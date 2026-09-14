<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSlot extends Model
{
    protected $fillable = [
        'date', 'start_time', 'end_time', 
        'is_available', 'booked_by_name', 'booked_by_email', 'notes'
    ];

    protected $casts = [
        'date' => 'date',
        'is_available' => 'boolean',
    ];

    public function scopeAvailable($query)
    {
        return $query->where('is_available', true)
                     ->where('date', '>=', now()->toDateString());
    }
}
