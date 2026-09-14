<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;

class BlogPost extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug', 'title', 'excerpt', 'content', 
        'featured_image', 'meta', 'is_published', 'published_at'
    ];

    protected $casts = [
        'meta' => 'array',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                     ->where('published_at', '<=', now());
    }

    // URL Accessor
    protected function url(): Attribute
    {
        return Attribute::make(
            get: fn () => "/blog/{$this->slug}"
        );
    }
}
