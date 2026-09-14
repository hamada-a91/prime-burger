import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface SettingsMap {
    [key: string]: string | number | boolean | object | null;
}

export function useSettings() {
    return useQuery({
        queryKey: ['settings'],
        queryFn: () => api.get<SettingsMap>('/settings'),
    });
}

export function useUpdateSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SettingsMap) => api.post<{ message: string; settings: SettingsMap }>('/admin/settings', data),
        onSuccess: (data) => {
            queryClient.setQueryData(['settings'], data.settings);
            queryClient.invalidateQueries({ queryKey: ['settings'] });
        },
    });
}
