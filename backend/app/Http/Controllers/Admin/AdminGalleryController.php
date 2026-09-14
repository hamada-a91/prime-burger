<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use App\Support\ImageProcessor;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminGalleryController extends Controller
{
    public function index(Request $request)
    {
        $query = GalleryImage::orderBy('sort_order')->orderBy('id');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        return response()->json($query->get());
    }

    /** Upload one or more images. Each becomes its own gallery entry. */
    public function store(Request $request)
    {
        $request->validate([
            'images' => 'required|array|min:1|max:20',
            'images.*' => 'required|image|mimes:jpeg,png,webp|max:15360',
            'category' => ['nullable', Rule::in(GalleryImage::CATEGORIES)],
        ]);

        $nextSort = (int) GalleryImage::max('sort_order') + 1;
        $created = [];

        foreach ($request->file('images') as $file) {
            $stored = ImageProcessor::store($file, 'gallery');
            $created[] = GalleryImage::create([
                ...$stored,
                'category' => $request->input('category', 'food'),
                'sort_order' => $nextSort++,
            ]);
        }

        return response()->json($created, 201);
    }

    public function update(Request $request, GalleryImage $gallery)
    {
        $data = $request->validate([
            'caption' => 'nullable|array',
            'caption.de' => 'nullable|string|max:200',
            'caption.en' => 'nullable|string|max:200',
            'category' => ['sometimes', Rule::in(GalleryImage::CATEGORIES)],
            'is_featured' => 'boolean',
            'featured_title' => 'nullable|array',
            'featured_title.de' => 'nullable|string|max:120',
            'featured_title.en' => 'nullable|string|max:120',
            'featured_subtitle' => 'nullable|array',
            'featured_subtitle.de' => 'nullable|string|max:160',
            'featured_subtitle.en' => 'nullable|string|max:160',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $gallery->update($data);

        return response()->json($gallery->fresh());
    }

    public function destroy(GalleryImage $gallery)
    {
        $gallery->deleteFiles();
        $gallery->delete();

        return response()->noContent();
    }

    public function reorder(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'integer|exists:gallery_images,id'])['ids'];

        foreach ($ids as $index => $id) {
            GalleryImage::where('id', $id)->update(['sort_order' => $index]);
        }

        return response()->json(['success' => true]);
    }
}
