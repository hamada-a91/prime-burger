<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuItem extends Model
{
    use HasTranslations;

    public const ALLERGENS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'L', 'M', 'N', 'O', 'P', 'R'];

    public const TAGS = ['vegan', 'vegetarian', 'spicy', 'signature', 'new'];

    protected $fillable = [
        'category_id', 'name', 'description', 'price', 'variants', 'price_note',
        'allergens', 'tags', 'is_available', 'sort_order',
    ];

    protected $casts = [
        'name' => 'array',
        'description' => 'array',
        'price' => 'decimal:2',
        'variants' => 'array',
        'price_note' => 'array',
        'allergens' => 'array',
        'tags' => 'array',
        'is_available' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(MenuCategory::class, 'category_id');
    }
}
