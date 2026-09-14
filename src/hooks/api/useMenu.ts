import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { MenuCategory, MenuItem } from '@/types/api';

export function useMenu() {
    return useQuery({
        queryKey: ['menu'],
        queryFn: () => api.get<MenuCategory[]>('/menu'),
    });
}

// ---- Admin ----

export type CategoryInput = Pick<MenuCategory, 'name' | 'description' | 'is_active'> & { sort_order?: number };
export type ItemInput = Omit<MenuItem, 'id' | 'sort_order' | 'category'> & { sort_order?: number };

function useInvalidateMenu() {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ['menu'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'menu'] });
    };
}

export function useAdminCategories() {
    return useQuery({
        queryKey: ['admin', 'menu', 'categories'],
        queryFn: () => api.get<MenuCategory[]>('/admin/menu-categories'),
    });
}

export function useAdminItems(categoryId?: number) {
    return useQuery({
        queryKey: ['admin', 'menu', 'items', categoryId ?? 'all'],
        queryFn: () => api.get<MenuItem[]>(`/admin/menu-items${categoryId ? `?category_id=${categoryId}` : ''}`),
    });
}

export function useSaveCategory() {
    const invalidate = useInvalidateMenu();
    return useMutation({
        mutationFn: ({ id, ...data }: CategoryInput & { id?: number }) =>
            id ? api.put<MenuCategory>(`/admin/menu-categories/${id}`, data) : api.post<MenuCategory>('/admin/menu-categories', data),
        onSuccess: invalidate,
    });
}

export function useDeleteCategory() {
    const invalidate = useInvalidateMenu();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/admin/menu-categories/${id}`),
        onSuccess: invalidate,
    });
}

export function useReorderCategories() {
    const invalidate = useInvalidateMenu();
    return useMutation({
        mutationFn: (ids: number[]) => api.post('/admin/menu-categories/reorder', { ids }),
        onSuccess: invalidate,
    });
}

export function useSaveItem() {
    const invalidate = useInvalidateMenu();
    return useMutation({
        mutationFn: ({ id, ...data }: ItemInput & { id?: number }) =>
            id ? api.put<MenuItem>(`/admin/menu-items/${id}`, data) : api.post<MenuItem>('/admin/menu-items', data),
        onSuccess: invalidate,
    });
}

export function useDeleteItem() {
    const invalidate = useInvalidateMenu();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/admin/menu-items/${id}`),
        onSuccess: invalidate,
    });
}

export function useReorderItems() {
    const invalidate = useInvalidateMenu();
    return useMutation({
        mutationFn: (ids: number[]) => api.post('/admin/menu-items/reorder', { ids }),
        onSuccess: invalidate,
    });
}
