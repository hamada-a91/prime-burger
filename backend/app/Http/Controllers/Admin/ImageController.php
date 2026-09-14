<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ImageController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,webp,gif|max:10240',
        ]);

        $file = $request->file('image');
        $filename = uniqid() . '_' . time() . '.webp';

        $manager = new ImageManager(new Driver());
        $image = $manager->read($file);

        if ($image->width() > 1920) {
            $image->scale(width: 1920);
        }

        $path = 'uploads/' . $filename;
        Storage::disk('public')->put($path, $image->toWebp(85));

        $thumbPath = 'uploads/thumbs/' . $filename;
        Storage::disk('public')->put($thumbPath, $manager->read($file)->scale(width: 400)->toWebp(80));

        return response()->json([
            'url' => Storage::disk('public')->url($path),
            'thumbnail' => Storage::disk('public')->url($thumbPath),
            'filename' => $filename,
        ]);
    }

    public function destroy(Request $request)
    {
        $request->validate(['filename' => 'required|string']);

        $filename = basename($request->input('filename'));
        $path = 'uploads/' . $filename;

        abort_unless(Storage::disk('public')->exists($path), 404);

        Storage::disk('public')->delete([$path, 'uploads/thumbs/' . $filename]);

        return response()->json(['success' => true]);
    }

    public function index()
    {
        $files = Storage::disk('public')->files('uploads');

        $images = collect($files)->filter(function ($file) {
            return !str_contains($file, 'thumbs/');
        })->map(function ($file) {
            $filename = basename($file);
            return [
                'filename' => $filename,
                'url' => Storage::disk('public')->url($file),
                'thumbnail' => Storage::disk('public')->url('uploads/thumbs/' . $filename),
                'size' => Storage::disk('public')->size($file),
                'created_at' => date('Y-m-d H:i:s', Storage::disk('public')->lastModified($file)),
            ];
        })->values();

        return response()->json($images);
    }
}
