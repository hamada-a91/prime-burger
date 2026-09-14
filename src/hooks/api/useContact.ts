import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ContactSubmission, ContactSlot, PaginatedResponse, ContactFormData, SlotFormData } from '@/types/api';

// ─────────────────────────────────────────
// Public Contact Hooks
// ─────────────────────────────────────────

export function useSubmitContact() {
    return useMutation({
        mutationFn: (data: ContactFormData) => api.post('/contact', data),
    });
}

export function useAvailableSlots(date?: string) {
    return useQuery({
        queryKey: ['contact-slots', date],
        queryFn: () => api.get<ContactSlot[]>(`/contact-slots${date ? `?date=${date}` : ''}`),
    });
}

// ─────────────────────────────────────────
// Admin Contact Submission Hooks
// ─────────────────────────────────────────

export function useContactSubmissions(page = 1) {
    return useQuery({
        queryKey: ['admin', 'contact-submissions', page],
        queryFn: () => api.get<PaginatedResponse<ContactSubmission>>(`/admin/contact-submissions?page=${page}`),
    });
}

export function useContactSubmission(id: number) {
    return useQuery({
        queryKey: ['admin', 'contact-submissions', id],
        queryFn: () => api.get<ContactSubmission>(`/admin/contact-submissions/${id}`),
        enabled: !!id,
    });
}

export function useUpdateContactStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: ContactSubmission['status'] }) =>
            api.patch<ContactSubmission>(`/admin/contact-submissions/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'contact-submissions'] });
        },
    });
}

// ─────────────────────────────────────────
// Admin Contact Slot Hooks
// ─────────────────────────────────────────

export function useContactSlots(date?: string) {
    return useQuery({
        queryKey: ['admin', 'contact-slots', date],
        queryFn: () => api.get<ContactSlot[]>(`/admin/contact-slots${date ? `?date=${date}` : ''}`),
    });
}

export function useCreateSlot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SlotFormData) => api.post<ContactSlot>('/admin/contact-slots', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'contact-slots'] });
            queryClient.invalidateQueries({ queryKey: ['contact-slots'] });
        },
    });
}

export function useDeleteSlot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => api.delete(`/admin/contact-slots/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'contact-slots'] });
            queryClient.invalidateQueries({ queryKey: ['contact-slots'] });
        },
    });
}
