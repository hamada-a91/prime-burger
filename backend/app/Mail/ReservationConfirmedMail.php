<?php

namespace App\Mail;

use App\Models\Reservation;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

/** Sent to the guest when the restaurant confirms the reservation in the admin. */
class ReservationConfirmedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Reservation $reservation) {}

    public function build()
    {
        return $this
            ->subject(__('messages.reservation.confirmed_subject'))
            ->markdown('emails.reservation-confirmed', [
                'phone' => Setting::get('contact_phone', ''),
                'address' => Setting::get('contact_address', []),
            ]);
    }
}
