<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSubmission extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'message', 
        'additional_data', 'status'
    ];

    protected $casts = [
        'additional_data' => 'array',
    ];
}
