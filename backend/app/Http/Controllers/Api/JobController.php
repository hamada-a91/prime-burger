<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobListing;

class JobController extends Controller
{
    public function index()
    {
        return JobListing::active()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function show(string $slug)
    {
        return JobListing::active()
            ->where('slug', $slug)
            ->firstOrFail();
    }
}
