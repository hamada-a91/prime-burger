<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    public const STATUSES = ['new', 'confirmed', 'declined', 'archived'];

    public const TIME_SLOTS = [
        '11:30', '12:00', '12:30', '13:00', '13:30',
        '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
    ];

    protected $fillable = [
        'name', 'email', 'phone', 'guests', 'date', 'time', 'notes', 'locale', 'status',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'guests' => 'integer',
    ];
}
