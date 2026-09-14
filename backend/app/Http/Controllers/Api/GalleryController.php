<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $query = GalleryImage::query()->orderBy('sort_order')->orderBy('id');

        if ($request->filled('category') && in_array($request->category, GalleryImage::CATEGORIES)) {
            $query->where('category', $request->category);
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        return response()->json($query->get());
    }
}
