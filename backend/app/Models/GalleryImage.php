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

    public function getUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->path);
    }

    public function getThumbUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->thumb_path);
    }

    public function deleteFiles(): void
    {
        Storage::disk('public')->delete(array_filter([$this->path, $this->thumb_path]));
    }
}
