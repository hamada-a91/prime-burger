import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { GalleryCategory, GalleryImage } from '@/types/api';

export function useGallery(options: { category?: GalleryCategory; featured?: boolean } = {}) {
    const params = new URLSearchParams();
    if (options.category) params.set('category', options.category);
    if (options.featured) params.set('featured', '1');
    const query = params.toString();

    return useQuery({
        queryKey: ['gallery', options.category ?? 'all', options.featured ? 'featured' : 'all'],
        queryFn: () => api.get<GalleryImage[]>(`/gallery${query ? `?${query}` : ''}`),
    });
}

// ---- Admin ----

export type GalleryUpdate = Partial<Pick<GalleryImage, 'caption' | 'category' | 'is_featured' | 'featured_title' | 'featured_subtitle' | 'sort_order'>>;

function useInvalidateGallery() {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ['gallery'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] });
    };
}

export function useAdminGallery() {
    return useQuery({
        queryKey: ['admin', 'gallery'],
        queryFn: () => api.get<GalleryImage[]>('/admin/gallery'),
    });
}

export function useUploadImages() {
    const invalidate = useInvalidateGallery();
    return useMutation({
        mutationFn: ({ files, category }: { files: File[]; category: GalleryCategory }) => {
            const form = new FormData();
            files.forEach((file) => form.append('images[]', file));
            form.append('category', category);
            return api.post<GalleryImage[]>('/admin/gallery', form);
        },
        onSuccess: invalidate,
    });
}

export function useUpdateImage() {
    const invalidate = useInvalidateGallery();
    return useMutation({
        mutationFn: ({ id, ...data }: GalleryUpdate & { id: number }) => api.put<GalleryImage>(`/admin/gallery/${id}`, data),
        onSuccess: invalidate,
    });
}

export function useDeleteImage() {
    const invalidate = useInvalidateGallery();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/admin/gallery/${id}`),
        onSuccess: invalidate,
    });
}

export function useReorderImages() {
    const invalidate = useInvalidateGallery();
    return useMutation({
        mutationFn: (ids: number[]) => api.post('/admin/gallery/reorder', { ids }),
        onSuccess: invalidate,
    });
}
