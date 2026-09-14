<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuCategory;

class MenuController extends Controller
{
    public function index()
    {
        $categories = MenuCategory::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->with(['items' => fn ($q) => $q->where('is_available', true)])
            ->get();

        return response()->json($categories);
    }
}
