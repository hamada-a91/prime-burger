@component('mail::message')
# {{ __('messages.reservation.received_title', ['name' => $reservation->name]) }}

{{ __('messages.reservation.received_intro') }}

**{{ __('messages.reservation.date') }}:** {{ $reservation->date->format('d.m.Y') }}
**{{ __('messages.reservation.time') }}:** {{ $reservation->time }} {{ __('messages.reservation.oclock') }}
**{{ __('messages.reservation.guests') }}:** {{ $reservation->guests }}

{{ __('messages.reservation.received_confirm') }}

@if($phone)
{{ __('messages.reservation.received_urgent', ['phone' => $phone]) }}
@endif

@if(!empty($address['street']))
{{ __('messages.reservation.address') }}: {{ $address['street'] }}, {{ $address['zip'] ?? '' }} {{ $address['city'] ?? '' }}
@endif

{{ __('messages.reservation.received_outro') }}
**Prime Burger Leipzig**
@endcomponent
