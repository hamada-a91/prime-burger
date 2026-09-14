<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection as BaseCollection;

class Setting extends Model
{
    /** Keys exposed via the public API and editable from the admin. */
    public const PUBLIC_KEYS = [
        'site_name',
        'contact_email',
        'contact_phone',
        'contact_address',
        'opening_hours',
        'delivery_platforms',
        'social_links',
        'maps_url',
        'hero_headline',
        'hero_subline',
        'about_story',
        'about_philosophy',
        'reservation_notice',
    ];

    /** Keys editable from the admin but never exposed publicly. */
    public const PRIVATE_KEYS = [
        'reservation_email',
    ];

    protected $fillable = ['key', 'value', 'group', 'type'];

    protected $casts = [
        'value' => 'json',
    ];

    public static function publicValues(): BaseCollection
    {
        return static::whereIn('key', self::PUBLIC_KEYS)->pluck('value', 'key');
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return static::where('key', $key)->first()?->value ?? $default;
    }
}
