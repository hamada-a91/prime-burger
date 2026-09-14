<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\HasUniqueSlug;
use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class AdminBlogController extends Controller
{
    use HasUniqueSlug;

    public function index()
    {
        return BlogPost::latest()->paginate(10);
    }

    public function show($id)
    {
        return BlogPost::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable',
            'is_published' => 'boolean',
        ]);

        $validated['slug'] = $this->makeSlugUnique($validated['slug'] ?? $validated['title'], BlogPost::class);
        $validated['content'] = strip_tags($validated['content'], '<p><br><strong><em><a><ul><ol><li><h2><h3><h4><blockquote><img><pre><code>');

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $this->uploadImage($request->file('featured_image'));
        } elseif (isset($validated['featured_image']) && is_string($validated['featured_image'])) {
            $validated['featured_image'] = $validated['featured_image'];
        }

        if ($validated['is_published'] ?? false) {
            $validated['published_at'] = now();
        }

        return response()->json(BlogPost::create($validated), 201);
    }

    public function update(Request $request, $id)
    {
        $post = BlogPost::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable',
            'is_published' => 'boolean',
        ]);

        $validated['slug'] = $this->makeSlugUnique($validated['slug'] ?? $validated['title'], BlogPost::class, $post->id);
        $validated['content'] = strip_tags($validated['content'], '<p><br><strong><em><a><ul><ol><li><h2><h3><h4><blockquote><img><pre><code>');

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $this->uploadImage($request->file('featured_image'));
        } elseif (is_string($request->featured_image) && $request->featured_image) {
            $validated['featured_image'] = $request->featured_image;
        }

        if (($validated['is_published'] ?? false) && ! $post->is_published) {
            $validated['published_at'] = now();
        }

        $post->update($validated);
        return response()->json($post);
    }

    public function destroy($id)
    {
        BlogPost::findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    private function uploadImage($file)
    {
        $manager = new ImageManager(new Driver());
        $image = $manager->read($file);

        $filename = Str::random(20) . '.webp';
        $path = storage_path('app/public/uploads/' . $filename);

        if (! file_exists(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        $image->toWebp(80)->save($path);

        return asset('storage/uploads/' . $filename);
    }
}
