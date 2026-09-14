<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Contact Info
            [
                'key' => 'contact_email',
                'value' => 'kontakt@example.com',
                'group' => 'contact',
                'type' => 'string'
            ],
            [
                'key' => 'contact_phone',
                'value' => '+49 123 456789',
                'group' => 'contact',
                'type' => 'string'
            ],
            [
                'key' => 'contact_address',
                'value' => [
                    'street' => 'Musterstraße 1',
                    'city' => 'Berlin',
                    'zip' => '10115',
                    'country' => 'Deutschland'
                ],
                'group' => 'contact',
                'type' => 'json'
            ],
            // Opening Hours
            [
                'key' => 'opening_hours',
                'value' => [
                    'Mo-Fr' => '09:00 - 18:00',
                    'Sa' => '10:00 - 14:00',
                    'So' => 'Geschlossen'
                ],
                'group' => 'contact',
                'type' => 'json'
            ],
            // Labels
            [
                'key' => 'label_phone',
                'value' => 'Rufen Sie uns an',
                'group' => 'labels',
                'type' => 'string'
            ],
            [
                'key' => 'label_email',
                'value' => 'Schreiben Sie uns',
                'group' => 'labels',
                'type' => 'string'
            ],
             [
                'key' => 'label_address',
                'value' => 'Besuchen Sie uns',
                'group' => 'labels',
                'type' => 'string'
            ],
        ];

        foreach ($settings as $setting) {
            Setting::firstOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
