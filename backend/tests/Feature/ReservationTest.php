<?php

namespace Tests\Feature;

use App\Mail\ReservationConfirmedMail;
use App\Mail\ReservationReceivedMail;
use App\Mail\ReservationRequestMail;
use App\Models\Reservation;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Lena Hartmann',
            'email' => 'lena@example.com',
            'phone' => '0341 1234567',
            'guests' => 4,
            'date' => now()->addDays(2)->toDateString(),
            'time' => '19:00',
            'notes' => 'Fensterplatz, wenn möglich',
        ], $overrides);
    }

    public function test_guest_can_request_reservation_and_both_mails_are_sent(): void
    {
        Mail::fake();
        config(['mail.reservation_address' => null]);
        Setting::create(['key' => 'reservation_email', 'value' => 'restaurant@example.com']);

        $response = $this->withHeader('X-Locale', 'en')->postJson('/api/reservations', $this->payload());

        $response->assertCreated()->assertJsonPath('success', true);
        $this->assertDatabaseHas('reservations', ['email' => 'lena@example.com', 'status' => 'new', 'locale' => 'en']);

        Mail::assertQueued(ReservationRequestMail::class, fn ($mail) => $mail->hasTo('restaurant@example.com'));
        Mail::assertQueued(ReservationReceivedMail::class, fn ($mail) => $mail->hasTo('lena@example.com'));
    }

    public function test_past_date_and_invalid_time_are_rejected(): void
    {
        Mail::fake();

        $this->postJson('/api/reservations', $this->payload(['date' => now()->subDay()->toDateString()]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['date']);

        $this->postJson('/api/reservations', $this->payload(['time' => '03:00']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['time']);

        Mail::assertNothingOutgoing();
    }

    public function test_honeypot_submission_is_silently_ignored(): void
    {
        Mail::fake();

        $this->postJson('/api/reservations', $this->payload(['website' => 'http://spam.example']))
            ->assertOk();

        $this->assertDatabaseCount('reservations', 0);
        Mail::assertNothingOutgoing();
    }

    public function test_confirming_a_reservation_notifies_the_guest_once(): void
    {
        Mail::fake();
        $this->withHeader('X-Locale', 'en')->postJson('/api/reservations', $this->payload());
        $reservation = Reservation::firstOrFail();
        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->patchJson("/api/admin/reservations/{$reservation->id}/status", ['status' => 'confirmed'])
            ->assertOk()
            ->assertJsonPath('mail_sent', true);

        Mail::assertQueued(ReservationConfirmedMail::class, fn ($mail) => $mail->hasTo($reservation->email));
        Mail::assertQueuedCount(3); // Anfrage ans Restaurant, Eingangsbestätigung, Zusage

        // Erneutes Speichern desselben Status schickt keine zweite Zusage.
        $this->actingAs($admin)
            ->patchJson("/api/admin/reservations/{$reservation->id}/status", ['status' => 'confirmed'])
            ->assertOk()
            ->assertJsonPath('mail_sent', false);

        Mail::assertQueuedCount(3);
    }

    public function test_declining_a_reservation_sends_no_guest_mail(): void
    {
        Mail::fake();
        $this->postJson('/api/reservations', $this->payload());
        $reservation = Reservation::firstOrFail();

        $this->actingAs(User::factory()->create())
            ->patchJson("/api/admin/reservations/{$reservation->id}/status", ['status' => 'declined'])
            ->assertOk()
            ->assertJsonPath('mail_sent', false);

        Mail::assertNotQueued(ReservationConfirmedMail::class);
    }

    public function test_admin_can_list_and_update_reservation_status(): void
    {
        Mail::fake();
        $this->postJson('/api/reservations', $this->payload());

        $this->getJson('/api/admin/reservations')->assertUnauthorized();

        $admin = User::factory()->create();
        $list = $this->actingAs($admin)->getJson('/api/admin/reservations')->assertOk();
        $id = $list->json('data.0.id');

        $this->actingAs($admin)
            ->patchJson("/api/admin/reservations/{$id}/status", ['status' => 'confirmed'])
            ->assertOk()
            ->assertJsonPath('status', 'confirmed');
    }
}
