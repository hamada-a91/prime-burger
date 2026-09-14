@component('mail::message')
# {{ __('messages.reservation.request_title') }}

**{{ __('messages.reservation.name') }}:** {{ $reservation->name }}
**{{ __('messages.reservation.email') }}:** {{ $reservation->email }}
**{{ __('messages.reservation.phone') }}:** {{ $reservation->phone }}
**{{ __('messages.reservation.guests') }}:** {{ $reservation->guests }}
**{{ __('messages.reservation.date') }}:** {{ $reservation->date->format('d.m.Y') }}
**{{ __('messages.reservation.time') }}:** {{ $reservation->time }} {{ __('messages.reservation.oclock') }}
**{{ __('messages.reservation.language') }}:** {{ strtoupper($reservation->locale) }}

## {{ __('messages.reservation.notes') }}

{{ $reservation->notes ?: __('messages.common.not_provided') }}

@component('mail::button', ['url' => rtrim(config('app.frontend_url'), '/') . '/admin/reservations'])
{{ __('messages.reservation.view_in_admin') }}
@endcomponent

{{ __('messages.reservation.reply_hint') }}
@endcomponent
