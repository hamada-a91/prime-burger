<?php

namespace App\Console\Commands;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use Database\Seeders\MenuSeeder;
use Illuminate\Console\Command;

/**
 * Importiert die Speisekarte neu, ohne Reservierungen, Galerie oder Einstellungen anzufassen.
 * Achtung: Änderungen, die im Admin an der Karte gemacht wurden, gehen dabei verloren.
 */
class RefreshMenu extends Command
{
    protected $signature = 'menu:refresh {--force : Ohne Rückfrage ausführen}';

    protected $description = 'Löscht die Speisekarte und importiert sie neu aus dem MenuSeeder';

    public function handle(): int
    {
        $items = MenuItem::count();
        $categories = MenuCategory::count();

        if (! $this->option('force')
            && ! $this->confirm("{$categories} Kategorien und {$items} Gerichte werden gelöscht und neu importiert. Fortfahren?")) {
            $this->info('Abgebrochen.');

            return self::SUCCESS;
        }

        MenuItem::query()->delete();
        MenuCategory::query()->delete();

        $this->call('db:seed', ['--class' => MenuSeeder::class, '--force' => true]);

        $this->info(MenuCategory::count().' Kategorien und '.MenuItem::count().' Gerichte importiert.');

        return self::SUCCESS;
    }
}
