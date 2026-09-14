<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobListing extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug', 'title', 'description', 'requirements',
        'tasks', 'foot_notes',
        'location', 'type', 'salary_range', 'department',
        'is_active', 'expires_at'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                     ->where(function ($q) {
                         $q->whereNull('expires_at')
                           ->orWhere('expires_at', '>', now());
                     });
    }
}
