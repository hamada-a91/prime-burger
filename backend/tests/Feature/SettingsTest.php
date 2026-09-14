<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_public_settings(): void
    {
        Setting::create(['key' => 'contact_email', 'value' => 'test@example.com']);

        $response = $this->getJson('/api/settings');

        $response->assertOk()
                 ->assertJsonPath('contact_email', 'test@example.com');
    }

    public function test_admin_can_update_settings(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/admin/settings', [
                'contact_email' => 'new@example.com',
                'contact_phone' => '+49 123 456789',
            ]);

        $response->assertOk();
        $this->assertDatabaseHas('settings', [
            'key' => 'contact_email',
            'value' => '"new@example.com"',
        ]);
    }
}
