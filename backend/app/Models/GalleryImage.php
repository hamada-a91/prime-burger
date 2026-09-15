<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class GalleryImage extends Model
{
    use HasTranslations;

    public const CATEGORIES = ['burger', 'food', 'ambience', 'drinks', 'misc'];

    protected $fillable = [
        'path', 'thumb_path', 'caption', 'category', 'is_featured',
        'featured_title', 'featured_subtitle', 'sort_order', 'width', 'height',
    ];

    protected $casts = [
        'caption' => 'array',
        'featured_title' => 'array',
        'featured_subtitle' => 'array',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
    ];

    protected $appends = ['url', 'thumb_url'];

    /**
     * Relative URLs (/storage/...): Frontend und API sind in Produktion (nginx) und lokal (Vite-Proxy)
     * same-origin, so funktionieren die Bilder auch hinter Tunneln ohne APP_URL-Anpassung.
     */
    public function getUrlAttribute(): string
    {
        return self::relativeUrl($this->path);
    }

    public function getThumbUrlAttribute(): string
    {
        return self::relativeUrl($this->thumb_path);
    }

    private static function relativeUrl(string $path): string
    {
        $url = Storage::disk('public')->url($path);
        $parsed = parse_url($url);

        return ($parsed['path'] ?? '/storage/' . ltrim($path, '/'));
    }

    public function deleteFiles(): void
    {
        Storage::disk('public')->delete(array_filter([$this->path, $this->thumb_path]));
    }
}
