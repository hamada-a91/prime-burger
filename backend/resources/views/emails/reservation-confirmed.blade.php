@component('mail::message')
# {{ __('messages.reservation.confirmed_title', ['name' => $reservation->name]) }}

{{ __('messages.reservation.confirmed_intro') }}

**{{ __('messages.reservation.date') }}:** {{ $reservation->date->format('d.m.Y') }}
**{{ __('messages.reservation.time') }}:** {{ $reservation->time }} {{ __('messages.reservation.oclock') }}
**{{ __('messages.reservation.guests') }}:** {{ $reservation->guests }}

@if(!empty($address['street']))
{{ __('messages.reservation.address') }}: {{ $address['street'] }}, {{ $address['zip'] ?? '' }} {{ $address['city'] ?? '' }}
@endif

@if($phone)
{{ __('messages.reservation.confirmed_change', ['phone' => $phone]) }}
@endif

{{ __('messages.reservation.confirmed_outro') }}
**Prime Burger Leipzig**
@endcomponent
