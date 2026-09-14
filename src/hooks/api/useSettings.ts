import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { SettingsMap } from '@/types/api';

export function useSettings() {
    return useQuery({
        queryKey: ['settings'],
        queryFn: () => api.get<SettingsMap>('/settings'),
        staleTime: 10 * 60 * 1000,
    });
}

export function useAdminSettings() {
    return useQuery({
        queryKey: ['admin', 'settings'],
        queryFn: () => api.get<SettingsMap>('/admin/settings'),
    });
}

export function useUpdateSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SettingsMap) => api.post<{ message: string; settings: SettingsMap }>('/admin/settings', data),
        onSuccess: (data) => {
            queryClient.setQueryData(['admin', 'settings'], data.settings);
            queryClient.invalidateQueries({ queryKey: ['settings'] });
        },
    });
}
