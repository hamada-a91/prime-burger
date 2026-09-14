<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\ContactSubmission;
use App\Models\JobListing;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Schema;

class StatsController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $weekAgo = $now->copy()->subDays(7);
        $monthAgo = $now->copy()->subDays(30);

        $countsByDay = ContactSubmission::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', $monthAgo)
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date');

        $byDay = collect(CarbonPeriod::create($monthAgo->toDateString(), $now->toDateString()))
            ->map(fn (Carbon $date) => [
                'date' => $date->toDateString(),
                'count' => (int) ($countsByDay[$date->toDateString()] ?? 0),
            ])
            ->values();

        $stats = [
            'contacts' => [
                'total' => ContactSubmission::count(),
                'new' => ContactSubmission::where('status', 'new')->count(),
                'today' => ContactSubmission::whereDate('created_at', $now->toDateString())->count(),
                'this_week' => ContactSubmission::where('created_at', '>=', $weekAgo)->count(),
                'this_month' => ContactSubmission::where('created_at', '>=', $monthAgo)->count(),
                'by_day' => $byDay,
            ],
            'blog' => [
                'total' => BlogPost::count(),
                'published' => BlogPost::where('is_published', true)->count(),
                'drafts' => BlogPost::where('is_published', false)->count(),
            ],
            'jobs' => [
                'total' => JobListing::count(),
                'active' => JobListing::where('is_active', true)->count(),
                'expired' => JobListing::where('is_active', true)
                    ->where('expires_at', '<', $now)
                    ->count(),
            ],
        ];

        if (Schema::hasTable('team_members')) {
            $stats['team'] = ['total' => \DB::table('team_members')->count()];
        }

        return response()->json($stats);
    }
}
