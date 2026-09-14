<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactFormMail;
use App\Models\ContactSubmission;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:50',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|min:10',
            'website' => 'nullable|string|max:255',
        ]);

        if (! empty($validated['website'])) {
            return response()->json([
                'success' => true,
                'message' => __('messages.contact.sent'),
            ]);
        }

        unset($validated['website']);
        $subject = $validated['subject'] ?? null;
        unset($validated['subject']);
        if ($subject) {
            $validated['additional_data'] = ['subject' => $subject];
        }
        $submission = ContactSubmission::create($validated);

        $adminEmail = config('mail.admin_email')
            ?: Setting::where('key', 'contact_email')->value('value')
            ?: config('mail.from.address');

        if ($adminEmail) {
            Mail::to($adminEmail)->send(new ContactFormMail($submission));
        } else {
            Log::warning('Keine Admin-Mail konfiguriert');
        }

        return response()->json([
            'success' => true,
            'message' => __('messages.contact.sent'),
        ], 201);
    }
}
