import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { BlogPost, PaginatedResponse, BlogFormData } from '@/types/api';

// ─────────────────────────────────────────
// Public Blog Hooks
// ─────────────────────────────────────────

export function useBlogPosts(page = 1) {
    return useQuery({
        queryKey: ['posts', page],
        queryFn: () => api.get<PaginatedResponse<BlogPost>>(`/posts?page=${page}`),
    });
}

export function useBlogPost(slug: string) {
    return useQuery({
        queryKey: ['posts', slug],
        queryFn: () => api.get<BlogPost>(`/posts/${slug}`),
        enabled: !!slug,
    });
}

// ─────────────────────────────────────────
// Admin Blog Hooks
// ─────────────────────────────────────────

export function useAdminBlogPosts(page = 1) {
    return useQuery({
        queryKey: ['admin', 'posts', page],
        queryFn: () => api.get<PaginatedResponse<BlogPost>>(`/admin/posts?page=${page}`),
    });
}

export function useAdminBlogPost(id: number | string) {
    return useQuery({
        queryKey: ['admin', 'posts', id],
        queryFn: () => api.get<BlogPost>(`/admin/posts/${id}`),
        enabled: !!id && id !== 'new',
    });
}

// Helper to convert object to FormData
function toFormData(data: BlogFormData): FormData | Record<string, unknown> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (key === 'featured_image' && value instanceof File) {
                formData.append(key, value);
            } else if (key === 'is_published') {
                formData.append(key, value ? '1' : '0');
            } else {
                formData.append(key, String(value));
            }
        }
    });

    // If no file, we can potentially send JSON, but Controller now expects FormData if file is present.
    // However, Laravel handles multipart/form-data for all fields fine.
    // BUT: PUT requests with FormData in Laravel/PHP are tricky (method spoofing needed).

    return formData;
}

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BlogFormData) => {
            const formData = toFormData(data);
            // If it's FormData, we need to let the browser set Content-Type header (don't set application/json)
            // Our api client sets application/json by default. We might need to override.
            // Actually, fetch handles FormData automatically if body is FormData.
            // BUT our api wrapper sets 'Content-Type': 'application/json' in defaults.
            // We need to modify api client or just pass a flag.
            // Simplest way: if data is FormData, remove Content-Type.

            // Wait, our current api.ts wrapper forces application/json. 
            // We need to update api.ts first to handle FormData!

            // For now, let's assume api.post handles it if we pass a special flag or modify api.ts generally.
            // Let's modify api.ts to not set Content-Type if body is FormData.
            return api.post<BlogPost>('/admin/posts', formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: BlogFormData & { id: number }) => {
            const formData = toFormData(data) as FormData;
            // Laravel requires _method=PUT for FormData updates
            formData.append('_method', 'PUT');
            return api.post<BlogPost>(`/admin/posts/${id}`, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => api.delete(`/admin/posts/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}
