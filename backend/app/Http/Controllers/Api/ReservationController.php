<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ReservationReceivedMail;
use App\Mail\ReservationRequestMail;
use App\Models\Reservation;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:190',
            'phone' => 'required|string|max:50',
            'guests' => 'required|integer|min:1|max:20',
            'date' => 'required|date_format:Y-m-d|after_or_equal:today',
            'time' => ['required', Rule::in(Reservation::TIME_SLOTS)],
            'notes' => 'nullable|string|max:1000',
            'website' => 'nullable|string|max:255', // honeypot
        ]);

        // Bots fill the hidden honeypot field: pretend success, store nothing.
        if (! empty($validated['website'])) {
            return response()->json(['success' => true, 'message' => __('messages.reservation.sent')]);
        }
        unset($validated['website']);

        $validated['locale'] = in_array(app()->getLocale(), ['de', 'en']) ? app()->getLocale() : 'de';
        $reservation = Reservation::create($validated);

        $restaurantEmail = config('mail.reservation_address')
            ?: Setting::get('reservation_email')
            ?: Setting::get('contact_email')
            ?: config('mail.from.address');

        if ($restaurantEmail) {
            Mail::to($restaurantEmail)->send(new ReservationRequestMail($reservation));
        } else {
            Log::warning('Keine Empfängeradresse für Reservierungen konfiguriert.');
        }

        Mail::to($reservation->email)->locale($reservation->locale)->send(new ReservationReceivedMail($reservation));

        return response()->json([
            'success' => true,
            'message' => __('messages.reservation.sent'),
        ], 201);
    }
}
