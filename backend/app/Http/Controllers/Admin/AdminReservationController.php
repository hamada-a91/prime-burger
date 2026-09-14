<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminReservationController extends Controller
{
    public function index(Request $request)
    {
        $query = Reservation::query()->orderByDesc('created_at');

        if ($request->filled('status') && in_array($request->status, Reservation::STATUSES)) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->filled('search')) {
            $term = '%' . $request->search . '%';
            $query->where(fn ($q) => $q->where('name', 'like', $term)
                ->orWhere('email', 'like', $term)
                ->orWhere('phone', 'like', $term));
        }

        return response()->json($query->paginate(20));
    }

    public function show(Reservation $reservation)
    {
        return response()->json($reservation);
    }

    public function updateStatus(Request $request, Reservation $reservation)
    {
        $data = $request->validate(['status' => ['required', Rule::in(Reservation::STATUSES)]]);
        $reservation->update($data);

        return response()->json($reservation->fresh());
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();

        return response()->noContent();
    }
}
