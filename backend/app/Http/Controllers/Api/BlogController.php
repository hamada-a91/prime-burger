<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    // GET /api/posts
    public function index(Request $request)
    {
        $posts = BlogPost::published()
            ->orderBy('published_at', 'desc')
            ->paginate($request->get('per_page', 10));

        return response()->json($posts);
    }

    // GET /api/posts/{slug}
    public function show(string $slug)
    {
        $post = BlogPost::published()
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($post);
    }
}
