import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { PaginatedResponse, Reservation, ReservationFormData, ReservationStatus } from '@/types/api';

export function useSubmitReservation() {
    return useMutation({
        mutationFn: (data: ReservationFormData) => api.post<{ success: boolean; message: string }>('/reservations', data),
    });
}

// ---- Admin ----

export interface ReservationFilters {
    page?: number;
    status?: ReservationStatus | '';
    date?: string;
    search?: string;
}

export function useAdminReservations(filters: ReservationFilters = {}) {
    const params = new URLSearchParams();
    if (filters.page && filters.page > 1) params.set('page', String(filters.page));
    if (filters.status) params.set('status', filters.status);
    if (filters.date) params.set('date', filters.date);
    if (filters.search) params.set('search', filters.search);
    const query = params.toString();

    return useQuery({
        queryKey: ['admin', 'reservations', filters],
        queryFn: () => api.get<PaginatedResponse<Reservation>>(`/admin/reservations${query ? `?${query}` : ''}`),
        placeholderData: (previous) => previous,
    });
}

/** `mail_sent` ist true, wenn der Gast dadurch die automatische Zusage bekommen hat. */
export type StatusUpdateResult = Reservation & { mail_sent: boolean };

export function useUpdateReservationStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: ReservationStatus }) =>
            api.patch<StatusUpdateResult>(`/admin/reservations/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'reservations'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
        },
    });
}

export function useDeleteReservation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/admin/reservations/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'reservations'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
        },
    });
}
