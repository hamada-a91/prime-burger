<?php

namespace Tests\Feature;

use App\Models\GalleryImage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GalleryTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_gallery_can_be_filtered_by_category_and_featured(): void
    {
        GalleryImage::create(['path' => 'a.webp', 'thumb_path' => 'ta.webp', 'category' => 'burger', 'is_featured' => true]);
        GalleryImage::create(['path' => 'b.webp', 'thumb_path' => 'tb.webp', 'category' => 'ambience']);

        $this->getJson('/api/gallery')->assertOk()->assertJsonCount(2);
        $this->getJson('/api/gallery?category=ambience')->assertOk()->assertJsonCount(1)->assertJsonPath('0.category', 'ambience');
        $this->getJson('/api/gallery?featured=1')->assertOk()->assertJsonCount(1)->assertJsonPath('0.is_featured', true);
    }

    public function test_admin_can_upload_update_and_delete_images(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create();

        $upload = $this->actingAs($admin)->post('/api/admin/gallery', [
            'images' => [UploadedFile::fake()->image('burger.jpg', 800, 600)],
            'category' => 'burger',
        ], ['Accept' => 'application/json'])->assertCreated();

        $id = $upload->json('0.id');
        $path = $upload->json('0.path');
        Storage::disk('public')->assertExists($path);

        $this->actingAs($admin)->putJson("/api/admin/gallery/{$id}", [
            'is_featured' => true,
            'featured_title' => ['de' => 'Titel', 'en' => 'Title'],
        ])->assertOk()->assertJsonPath('featured_title.en', 'Title');

        $this->actingAs($admin)->deleteJson("/api/admin/gallery/{$id}")->assertNoContent();
        Storage::disk('public')->assertMissing($path);
        $this->assertDatabaseCount('gallery_images', 0);
    }
}
