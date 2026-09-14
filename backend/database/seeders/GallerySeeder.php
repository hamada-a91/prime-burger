<?php

namespace Database\Seeders;

use App\Models\GalleryImage;
use App\Support\ImageProcessor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

/**
 * Imports the photos from material/gallery into storage (WebP + thumbs) and creates gallery entries.
 * Runs only when the gallery is empty so admin edits are never overwritten.
 */
class GallerySeeder extends Seeder
{
    /** Home page highlights: filename => [title de, title en, subtitle de, subtitle en]. */
    private const FEATURED = [
        'the-real-big-prime' => ['The Real Big Prime', 'The Real Big Prime', 'Unser Signature Burger', 'Our signature burger'],
        'bbq-bacon-burger' => ['BBQ Bacon Burger', 'BBQ Bacon Burger', 'Rauchig & herzhaft', 'Smoky & hearty'],
        'cheese-bomb' => ['Cheese Bomb', 'Cheese Bomb', 'Für Käseliebhaber', 'For cheese lovers'],
        'pulled-pork-burger' => ['Pulled Pork Burger', 'Pulled Pork Burger', 'Zart & saftig', 'Tender & juicy'],
        'hawaii-burger' => ['Hawaii Burger', 'Hawaii Burger', 'Tropisch mit gegrillter Ananas', 'Tropical with grilled pineapple'],
        'haehnchen-shakshuka-burger' => ['Hähnchen Shakshuka', 'Chicken Shakshuka', 'Orientalisch inspiriert', 'Oriental inspired'],
        'vegetarischer-burger' => ['Vegetarischer Burger', 'Vegetarian Burger', 'Frisches Marktgemüse', 'Fresh market vegetables'],
    ];

    private const CAPTIONS = [
        'ambience-nr1' => ['Unser Gastraum', 'Our dining room'],
        'ambience-nr2' => ['Gemütliche Sitzecke', 'Cosy corner'],
        'ambience-nr3' => ['Holz, Licht und Wärme', 'Wood, light and warmth'],
        'the-real-big-prime' => ['The Real Big Prime', 'The Real Big Prime'],
        'spareribs' => ['Spareribs vom Grill', 'Grilled spareribs'],
        'steak-1' => ['Steak vom Grill', 'Grilled steak'],
        'burrito' => ['Burrito', 'Burrito'],
        'salat' => ['Frischer Salat', 'Fresh salad'],
        'shake-1' => ['Milchshake', 'Milkshake'],
        'taco-1' => ['Tacos', 'Tacos'],
        'taco-2' => ['Tacos', 'Tacos'],
        'taco-3' => ['Tacos', 'Tacos'],
        '5-dishes' => ['Zum Teilen', 'For sharing'],
        'tisch-of-food' => ['Für die ganze Runde', 'For the whole table'],
        'burger-tisch-1' => ['Burger für alle', 'Burgers for everyone'],
    ];

    public function run(): void
    {
        if (GalleryImage::exists()) {
            return;
        }

        $sourceDir = base_path('../material/gallery');
        if (! is_dir($sourceDir)) {
            $this->command?->warn("Galerie-Quellordner nicht gefunden: {$sourceDir}");

            return;
        }

        ini_set('memory_limit', '1024M');
        Storage::disk('public')->makeDirectory('gallery/thumbs');

        $files = collect(glob("{$sourceDir}/*.jpg"))
            ->sortBy(fn ($f) => $this->sortKey(basename($f, '.jpg')))
            ->values();

        foreach ($files as $index => $file) {
            $slug = basename($file, '.jpg');
            $stored = ImageProcessor::store($file, 'gallery', $slug);
            $featured = self::FEATURED[$slug] ?? null;
            $caption = self::CAPTIONS[$slug] ?? null;

            GalleryImage::create([
                ...$stored,
                'category' => $this->categoryFor($slug),
                'caption' => $caption ? ['de' => $caption[0], 'en' => $caption[1]] : null,
                'is_featured' => (bool) $featured,
                'featured_title' => $featured ? ['de' => $featured[0], 'en' => $featured[1]] : null,
                'featured_subtitle' => $featured ? ['de' => $featured[2], 'en' => $featured[3]] : null,
                'sort_order' => $index,
            ]);

            $this->command?->line("  imported {$slug}");
        }
    }

    private function categoryFor(string $slug): string
    {
        return match (true) {
            str_starts_with($slug, 'ambience') => 'ambience',
            str_starts_with($slug, 'shake') => 'drinks',
            str_starts_with($slug, 'misc') => 'misc',
            str_contains($slug, 'burger') || in_array($slug, ['the-real-big-prime', 'cheese-bomb', 'surf-and-turf']) => 'burger',
            default => 'food',
        };
    }

    /** Featured first, then ambience, then the rest in a pleasant mixed order. */
    private function sortKey(string $slug): string
    {
        $featuredIndex = array_search($slug, array_keys(self::FEATURED), true);
        if ($featuredIndex !== false) {
            return '0-' . str_pad((string) $featuredIndex, 2, '0', STR_PAD_LEFT);
        }
        if (str_starts_with($slug, 'ambience')) {
            return '1-' . $slug;
        }

        return '2-' . $slug;
    }
}
