<?php

namespace App\Mail;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

/** Sent to the restaurant when a guest submits a reservation request. */
class ReservationRequestMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Reservation $reservation) {}

    public function build()
    {
        return $this
            ->locale(config('app.locale'))
            ->replyTo($this->reservation->email, $this->reservation->name)
            ->subject(__('messages.reservation.request_subject', [
                'name' => $this->reservation->name,
                'date' => $this->reservation->date->format('d.m.Y'),
                'time' => $this->reservation->time,
            ]))
            ->markdown('emails.reservation-request');
    }
}
