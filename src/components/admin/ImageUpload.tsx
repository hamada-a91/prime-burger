import { useState, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string | null) => void;
    className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFile = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Bitte nur Bilddateien hochladen');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('Datei ist zu groß (max. 10MB)');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post('/admin/images', formData) as { url: string };
            onChange(response.url);
        } catch (err: unknown) {
            // Handle Laravel validation errors
            const apiError = err as {
                response?: {
                    data?: {
                        message?: string;
                        errors?: Record<string, string[]>
                    }
                };
                message?: string;
            };

            if (apiError.response?.data?.errors) {
                // Get first error message from validation errors
                const errors = apiError.response.data.errors;
                const firstErrorKey = Object.keys(errors)[0];
                const firstError = errors[firstErrorKey]?.[0];
                setError(firstError || apiError.response.data.message || 'Upload fehlgeschlagen');
            } else if (apiError.response?.data?.message) {
                setError(apiError.response.data.message);
            } else {
                setError('Upload fehlgeschlagen');
            }
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    }, [onChange]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDragOver(false);
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleRemove = () => {
        onChange(null);
    };

    if (value) {
        return (
            <div className={cn('relative rounded-lg overflow-hidden', className)}>
                <img src={value} alt="Upload" className="w-full h-48 object-cover" />
                <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemove}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
                'flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
                uploading && 'opacity-50 pointer-events-none',
                className
            )}
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="sr-only"
                disabled={uploading}
            />

            {uploading ? (
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Lädt hoch...</span>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        Bild hierher ziehen oder klicken
                    </span>
                    <span className="text-xs text-muted-foreground/75">
                        JPG, PNG, WebP, GIF bis 10MB
                    </span>
                </div>
            )}

            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </label>
    );
}
