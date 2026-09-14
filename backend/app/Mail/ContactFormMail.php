<?php

namespace App\Mail;

use App\Models\ContactSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactFormMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public ContactSubmission $submission
    ) {}

    public function build()
    {
        return $this->subject(__('messages.contact.mail_subject', ['name' => $this->submission->name]))
            ->markdown('emails.contact-form');
    }
}
