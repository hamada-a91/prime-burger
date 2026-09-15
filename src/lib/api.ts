/**
 * API client for Laravel Sanctum SPA sessions.
 * Uses HttpOnly session cookies plus XSRF-TOKEN, never localStorage tokens.
 */

const configuredApiUrl = import.meta.env.VITE_API_URL || '/api';
const API_BASE_URL = configuredApiUrl.replace(/\/+$/, '');
const API_ROOT = API_BASE_URL.replace(/\/api\/?$/, '');
const csrfMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export class ApiError extends Error {
    status: number;
    errors?: Record<string, string[]>;

    constructor(status: number, message: string, errors?: Record<string, string[]>) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
    }
}

function getCookie(name: string): string | null {
    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${name}=`));

    return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

class ApiClient {
    private csrfReady = false;
    /** Sent as X-Locale so validation messages and guest mails match the visitor's language. */
    locale = 'de';

    async csrf(): Promise<void> {
        await fetch(`${API_ROOT}/sanctum/csrf-cookie`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        this.csrfReady = true;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}, retried = false): Promise<T> {
        const method = (options.method || 'GET').toUpperCase();

        if (csrfMethods.has(method) && !this.csrfReady) {
            await this.csrf();
        }

        const isFormData = options.body instanceof FormData;
        const headers: Record<string, string> = {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Locale': this.locale,
            ...(options.headers as Record<string, string> | undefined),
        };

        if (!isFormData && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        const xsrfToken = csrfMethods.has(method) ? getCookie('XSRF-TOKEN') : null;
        if (xsrfToken) {
            headers['X-XSRF-TOKEN'] = xsrfToken;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            method,
            headers,
            credentials: 'include',
        });

        if (response.status === 419 && !retried) {
            this.csrfReady = false;
            await this.csrf();
            return this.request<T>(endpoint, options, true);
        }

        if (response.status === 204) {
            return undefined as T;
        }

        if (!response.ok) {
            let errorData: { message?: string; errors?: Record<string, string[]> } = {};
            try {
                errorData = await response.json();
            } catch {
                // Response body might be empty or not JSON.
            }

            throw new ApiError(
                response.status,
                errorData.message || `Request failed with status ${response.status}`,
                errorData.errors,
            );
        }

        return response.json();
    }

    get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    post<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined,
        });
    }

    put<T>(endpoint: string, data: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data instanceof FormData ? data : JSON.stringify(data),
        });
    }

    patch<T>(endpoint: string, data: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data instanceof FormData ? data : JSON.stringify(data),
        });
    }

    delete<T = void>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const api = new ApiClient();
