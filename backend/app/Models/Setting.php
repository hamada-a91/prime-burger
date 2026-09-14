<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection as BaseCollection;

class Setting extends Model
{
    public const PUBLIC_KEYS = [
        'site_name',
        'contact_email',
        'contact_phone',
        'contact_address',
        'opening_hours',
        'social_links',
        'label_phone',
        'label_email',
        'label_address',
    ];

    protected $fillable = ['key', 'value', 'group', 'type'];

    protected $casts = [
        'value' => 'json',
    ];

    public static function publicValues(): BaseCollection
    {
        return static::whereIn('key', self::PUBLIC_KEYS)->pluck('value', 'key');
    }
}
