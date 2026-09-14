@component('mail::message')
# {{ __('messages.contact.mail_title') }}

**{{ __('messages.contact.name') }}:** {{ $submission->name }}  
**{{ __('messages.contact.email') }}:** {{ $submission->email }}  
**{{ __('messages.contact.phone') }}:** {{ $submission->phone ?? __('messages.common.not_provided') }}

## {{ __('messages.contact.message') }}

{{ $submission->message }}

@component('mail::button', ['url' => rtrim(config('app.frontend_url'), '/') . '/admin/contact'])
{{ __('messages.contact.view_in_admin') }}
@endcomponent

@endcomponent
