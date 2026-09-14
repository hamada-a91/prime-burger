import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { DashboardStats } from '@/types/api';

export function useDashboardStats() {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: () => api.get<DashboardStats>('/admin/stats'),
    });
}
