import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Stats } from '@/types/api';

export function useStats() {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: () => api.get<Stats>('/admin/stats'),
        refetchInterval: 60 * 1000,
    });
}
