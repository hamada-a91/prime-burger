<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use App\Models\MenuItem;
use App\Models\Reservation;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class StatsController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $weekAgo = $now->copy()->subDays(7);
        $monthAgo = $now->copy()->subDays(30);

        // Alias bewusst nicht "date": die Tabelle hat eine Spalte gleichen Namens, MySQL würde
        // im GROUP BY die Spalte statt des Alias nehmen (Fehler 1055 bei ONLY_FULL_GROUP_BY).
        $countsByDay = Reservation::selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->where('created_at', '>=', $monthAgo)
            ->groupBy('day')
            ->orderBy('day')
            ->pluck('total', 'day');

        $byDay = collect(CarbonPeriod::create($monthAgo->toDateString(), $now->toDateString()))
            ->map(fn (Carbon $date) => [
                'date' => $date->toDateString(),
                'count' => (int) ($countsByDay[$date->toDateString()] ?? 0),
            ])
            ->values();

        return response()->json([
            'reservations' => [
                'total' => Reservation::count(),
                'new' => Reservation::where('status', 'new')->count(),
                'today' => Reservation::whereDate('created_at', $now->toDateString())->count(),
                'this_week' => Reservation::where('created_at', '>=', $weekAgo)->count(),
                'upcoming' => Reservation::where('status', 'confirmed')->whereDate('date', '>=', $now->toDateString())->count(),
                'by_day' => $byDay,
                'latest' => Reservation::orderByDesc('created_at')->limit(5)->get(),
            ],
            'menu' => [
                'items' => MenuItem::count(),
                'unavailable' => MenuItem::where('is_available', false)->count(),
            ],
            'gallery' => [
                'images' => GalleryImage::count(),
                'featured' => GalleryImage::where('is_featured', true)->count(),
            ],
        ]);
    }
}
