import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSettings } from './useSettings';
import { describe, it, expect, vi } from 'vitest';
import React from 'react'; // Fix for JSX implicitly using React

// Mock the API
vi.mock('@/lib/api', () => ({
    api: {
        get: vi.fn().mockResolvedValue({ contact_email: 'test@example.com' }),
    },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useSettings', () => {
    it('fetches settings from API', async () => {
        const { result } = renderHook(() => useSettings(), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.contact_email).toBe('test@example.com');
    });
});
