<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuCategory;
use Illuminate\Http\Request;

class AdminMenuCategoryController extends Controller
{
    public function index()
    {
        return response()->json(
            MenuCategory::orderBy('sort_order')->orderBy('id')->withCount('items')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['sort_order'] = $data['sort_order'] ?? ((int) MenuCategory::max('sort_order') + 1);

        return response()->json(MenuCategory::create($data), 201);
    }

    public function update(Request $request, MenuCategory $menuCategory)
    {
        $menuCategory->update($this->validated($request));

        return response()->json($menuCategory->fresh()->loadCount('items'));
    }

    public function destroy(MenuCategory $menuCategory)
    {
        $menuCategory->delete();

        return response()->noContent();
    }

    public function reorder(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'integer|exists:menu_categories,id'])['ids'];

        foreach ($ids as $index => $id) {
            MenuCategory::where('id', $id)->update(['sort_order' => $index]);
        }

        return response()->json(['success' => true]);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => 'required|array',
            'name.de' => 'required|string|max:120',
            'name.en' => 'nullable|string|max:120',
            'description' => 'nullable|array',
            'description.de' => 'nullable|string|max:500',
            'description.en' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);
    }
}
