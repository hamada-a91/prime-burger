<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminMenuItemController extends Controller
{
    public function index(Request $request)
    {
        $query = MenuItem::with('category')->orderBy('category_id')->orderBy('sort_order')->orderBy('id');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['sort_order'] = $data['sort_order']
            ?? ((int) MenuItem::where('category_id', $data['category_id'])->max('sort_order') + 1);

        return response()->json(MenuItem::create($data)->load('category'), 201);
    }

    public function update(Request $request, MenuItem $menuItem)
    {
        $menuItem->update($this->validated($request));

        return response()->json($menuItem->fresh()->load('category'));
    }

    public function destroy(MenuItem $menuItem)
    {
        $menuItem->delete();

        return response()->noContent();
    }

    public function reorder(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'integer|exists:menu_items,id'])['ids'];

        foreach ($ids as $index => $id) {
            MenuItem::where('id', $id)->update(['sort_order' => $index]);
        }

        return response()->json(['success' => true]);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'category_id' => 'required|integer|exists:menu_categories,id',
            'name' => 'required|array',
            'name.de' => 'required|string|max:120',
            'name.en' => 'nullable|string|max:120',
            'description' => 'nullable|array',
            'description.de' => 'nullable|string|max:600',
            'description.en' => 'nullable|string|max:600',
            'price' => 'nullable|numeric|min:0|max:9999',
            'variants' => 'nullable|array|max:10',
            'variants.*.label' => 'required_with:variants|array',
            'variants.*.label.de' => 'required_with:variants|string|max:60',
            'variants.*.label.en' => 'nullable|string|max:60',
            'variants.*.price' => 'required_with:variants|numeric|min:0|max:9999',
            'price_note' => 'nullable|array',
            'price_note.de' => 'nullable|string|max:200',
            'price_note.en' => 'nullable|string|max:200',
            'allergens' => 'nullable|array',
            'allergens.*' => [Rule::in(MenuItem::ALLERGENS)],
            'tags' => 'nullable|array',
            'tags.*' => [Rule::in(MenuItem::TAGS)],
            'is_available' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        if (empty($data['variants'])) {
            $data['variants'] = null;
        }

        return $data;
    }
}
