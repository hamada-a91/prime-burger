<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\JobListing;
use App\Models\ContactSubmission;
use App\Models\ContactSlot;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'totalPosts' => BlogPost::count(),
            'publishedPosts' => BlogPost::where('is_published', true)->count(),
            'totalJobs' => JobListing::count(),
            'activeJobs' => JobListing::where('is_active', true)->count(),
            'newContacts' => ContactSubmission::where('status', 'new')->count(),
            'upcomingSlots' => ContactSlot::where('date', '>=', now())->where('is_available', true)->count(),
        ]);
    }
}
