<?php

namespace Tests\Feature;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MenuTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_menu_only_contains_active_categories_and_available_items(): void
    {
        $active = MenuCategory::create(['name' => ['de' => 'Beef Burger', 'en' => 'Beef Burgers'], 'sort_order' => 1]);
        $hidden = MenuCategory::create(['name' => ['de' => 'Versteckt'], 'sort_order' => 0, 'is_active' => false]);

        MenuItem::create(['category_id' => $active->id, 'name' => ['de' => 'Prime Cheese'], 'price' => 11.4, 'allergens' => ['A', 'G']]);
        MenuItem::create(['category_id' => $active->id, 'name' => ['de' => 'Ausverkauft'], 'price' => 9, 'is_available' => false]);
        MenuItem::create(['category_id' => $hidden->id, 'name' => ['de' => 'Geheim'], 'price' => 1]);

        $response = $this->getJson('/api/menu')->assertOk();

        $response->assertJsonCount(1)
            ->assertJsonPath('0.name.en', 'Beef Burgers')
            ->assertJsonCount(1, '0.items')
            ->assertJsonPath('0.items.0.name.de', 'Prime Cheese')
            ->assertJsonPath('0.items.0.allergens', ['A', 'G']);
    }

    public function test_admin_can_create_item_with_variants(): void
    {
        $admin = User::factory()->create();
        $category = MenuCategory::create(['name' => ['de' => 'Getränke']]);

        $this->actingAs($admin)->postJson('/api/admin/menu-items', [
            'category_id' => $category->id,
            'name' => ['de' => 'Cola', 'en' => 'Coke'],
            'variants' => [
                ['label' => ['de' => '0,2 l', 'en' => '0.2 l'], 'price' => 3.2],
                ['label' => ['de' => '0,4 l', 'en' => '0.4 l'], 'price' => 4.9],
            ],
            'tags' => ['new'],
        ])->assertCreated()->assertJsonPath('variants.1.price', 4.9);

        $this->actingAs($admin)->postJson('/api/admin/menu-items', [
            'category_id' => $category->id,
            'name' => ['de' => 'Falsch'],
            'allergens' => ['Z'],
        ])->assertUnprocessable();
    }
}
