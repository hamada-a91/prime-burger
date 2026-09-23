<?php

namespace Tests\Feature;

use App\Models\GalleryImage;
use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_stats_returns_counts_and_daily_series(): void
    {
        $category = MenuCategory::create(['name' => ['de' => 'Beef Burger']]);
        MenuItem::create(['category_id' => $category->id, 'name' => ['de' => 'Prime Cheese'], 'price' => 11.4]);
        GalleryImage::create(['path' => 'a.webp', 'thumb_path' => 'ta.webp', 'is_featured' => true]);

        Reservation::create([
            'name' => 'Lena Hartmann', 'email' => 'lena@example.com', 'phone' => '0341 1',
            'guests' => 2, 'date' => now()->addDay()->toDateString(), 'time' => '19:00', 'status' => 'new',
        ]);

        $this->getJson('/api/admin/stats')->assertUnauthorized();

        $response = $this->actingAs(User::factory()->create())->getJson('/api/admin/stats')->assertOk();

        $response->assertJsonPath('reservations.total', 1)
            ->assertJsonPath('reservations.new', 1)
            ->assertJsonPath('reservations.today', 1)
            ->assertJsonPath('menu.items', 1)
            ->assertJsonPath('gallery.featured', 1)
            ->assertJsonCount(31, 'reservations.by_day')
            ->assertJsonCount(1, 'reservations.latest');

        $today = collect($response->json('reservations.by_day'))->firstWhere('date', now()->toDateString());
        $this->assertSame(1, $today['count']);
    }
}
