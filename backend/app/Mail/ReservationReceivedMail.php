<?php

namespace App\Mail;

use App\Models\Reservation;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

/** Sent to the guest right after submitting: "we received your request, confirmation follows". */
class ReservationReceivedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Reservation $reservation) {}

    public function build()
    {
        return $this
            ->subject(__('messages.reservation.received_subject'))
            ->markdown('emails.reservation-received', [
                'phone' => Setting::get('contact_phone', ''),
                'address' => Setting::get('contact_address', []),
            ]);
    }
}
