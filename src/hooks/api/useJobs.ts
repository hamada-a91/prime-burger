import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { JobListing, PaginatedResponse, JobFormData } from '@/types/api';

// ─────────────────────────────────────────
// Public Job Hooks
// ─────────────────────────────────────────

export function useJobs(page = 1) {
    return useQuery({
        queryKey: ['jobs', page],
        queryFn: () => api.get<PaginatedResponse<JobListing>>(`/jobs?page=${page}`),
    });
}

export function useJob(slug: string) {
    return useQuery({
        queryKey: ['jobs', slug],
        queryFn: () => api.get<JobListing>(`/jobs/${slug}`),
        enabled: !!slug,
    });
}

// ─────────────────────────────────────────
// Admin Job Hooks
// ─────────────────────────────────────────

export function useAdminJobs(page = 1) {
    return useQuery({
        queryKey: ['admin', 'jobs', page],
        queryFn: () => api.get<PaginatedResponse<JobListing>>(`/admin/jobs?page=${page}`),
    });
}

export function useAdminJob(id: number | string) {
    return useQuery({
        queryKey: ['admin', 'jobs', id],
        queryFn: () => api.get<JobListing>(`/admin/jobs/${id}`),
        enabled: !!id && id !== 'new',
    });
}

export function useCreateJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: JobFormData) => api.post<JobListing>('/admin/jobs', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
}

export function useUpdateJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: JobFormData & { id: number }) =>
            api.put<JobListing>(`/admin/jobs/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
}

export function useDeleteJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => api.delete(`/admin/jobs/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
}
