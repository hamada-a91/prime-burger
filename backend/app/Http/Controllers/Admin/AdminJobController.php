<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\HasUniqueSlug;
use App\Http\Controllers\Controller;
use App\Models\JobListing;
use Illuminate\Http\Request;

class AdminJobController extends Controller
{
    use HasUniqueSlug;

    public function index()
    {
        return JobListing::orderBy('created_at', 'desc')->paginate(20);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'tasks' => 'nullable|string',
            'foot_notes' => 'nullable|string',
            'type' => 'required|in:full-time,part-time,freelance,internship',
            'location' => 'nullable|string',
            'salary_range' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = $this->makeSlugUnique($validated['slug'] ?? $validated['title'], JobListing::class);

        return JobListing::create($validated);
    }

    public function show(JobListing $job)
    {
        return $job;
    }

    public function update(Request $request, JobListing $job)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'string',
            'requirements' => 'nullable|string',
            'tasks' => 'nullable|string',
            'foot_notes' => 'nullable|string',
            'type' => 'in:full-time,part-time,freelance,internship',
            'location' => 'nullable|string',
            'salary_range' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if (isset($validated['slug']) || isset($validated['title'])) {
            $validated['slug'] = $this->makeSlugUnique($validated['slug'] ?? $validated['title'], JobListing::class, $job->id);
        }

        $job->update($validated);
        return $job;
    }

    public function destroy(JobListing $job)
    {
        $job->delete();
        return response()->noContent();
    }
}
