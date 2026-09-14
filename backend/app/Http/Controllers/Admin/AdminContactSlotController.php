<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSlot;
use Illuminate\Http\Request;

class AdminContactSlotController extends Controller
{
    public function index()
    {
        return ContactSlot::orderBy('date', 'desc')->orderBy('start_time')->paginate(50);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'is_available' => 'boolean'
        ]);

        return ContactSlot::create($validated);
    }

    public function destroy(ContactSlot $contactSlot)
    {
        $contactSlot->delete();
        return response()->noContent();
    }
}
