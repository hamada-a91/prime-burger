<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'site_name', 'group' => 'general', 'value' => 'Prime Burger Leipzig'],
            ['key' => 'contact_email', 'group' => 'contact', 'value' => 'Kontakt@prime-burger.de'],
            ['key' => 'reservation_email', 'group' => 'contact', 'value' => 'Kontakt@prime-burger.de'],
            ['key' => 'contact_phone', 'group' => 'contact', 'value' => '0341 30853717'],
            ['key' => 'contact_address', 'group' => 'contact', 'value' => [
                'street' => 'Große Fleischergasse 4',
                'zip' => '04109',
                'city' => 'Leipzig',
                'country' => 'Deutschland',
            ]],
            ['key' => 'maps_url', 'group' => 'contact', 'value' => 'https://www.google.com/maps/search/?api=1&query=Prime+Burger+Gro%C3%9Fe+Fleischergasse+4+04109+Leipzig'],
            ['key' => 'opening_hours', 'group' => 'contact', 'value' => [
                'mon' => ['open' => '11:30', 'close' => '22:00', 'closed' => false],
                'tue' => ['open' => '11:30', 'close' => '22:00', 'closed' => false],
                'wed' => ['open' => '11:30', 'close' => '22:00', 'closed' => false],
                'thu' => ['open' => '11:30', 'close' => '22:00', 'closed' => false],
                'fri' => ['open' => '11:30', 'close' => '23:00', 'closed' => false],
                'sat' => ['open' => '11:30', 'close' => '23:00', 'closed' => false],
                'sun' => ['open' => '11:30', 'close' => '21:00', 'closed' => false],
            ]],
            ['key' => 'delivery_platforms', 'group' => 'general', 'value' => [
                ['key' => 'lieferando', 'name' => 'Lieferando', 'url' => 'https://www.lieferando.de/', 'eta' => '30-45 Min.', 'badge' => ['de' => 'Beliebt', 'en' => 'Popular']],
                ['key' => 'ubereats', 'name' => 'Uber Eats', 'url' => 'https://www.ubereats.com/de', 'eta' => '25-40 Min.', 'badge' => ['de' => 'Schnell', 'en' => 'Fast']],
                ['key' => 'wolt', 'name' => 'Wolt', 'url' => 'https://wolt.com/de/deu/leipzig', 'eta' => '30-50 Min.', 'badge' => ['de' => 'Neu', 'en' => 'New']],
            ]],
            ['key' => 'social_links', 'group' => 'social', 'value' => [
                'instagram' => '',
                'facebook' => '',
                'tripadvisor' => '',
            ]],
            ['key' => 'hero_headline', 'group' => 'texts', 'value' => [
                'de' => 'Willkommen im Prime Burger',
                'en' => 'Welcome to Prime Burger',
            ]],
            ['key' => 'hero_subline', 'group' => 'texts', 'value' => [
                'de' => 'Frisch gegrillte Burger, regionales Fleisch und ehrliche Küche. Seit 2015 mitten in Leipzig.',
                'en' => 'Freshly grilled burgers, regional beef and honest cooking. In the heart of Leipzig since 2015.',
            ]],
            ['key' => 'about_story', 'group' => 'texts', 'value' => [
                'de' => 'Die Idee zu Prime Burger entstand aus der Leidenschaft für gutes, ehrliches Essen. Wir wollten Burger anbieten, die wirklich frisch sind: ohne Fertigprodukte, ohne Kompromisse. Heute grillen wir jeden Burger frisch, mit Fleisch aus regionaler Herkunft und Zutaten, die man schmeckt. Ein Bissen, und du weißt, warum wir Burger so lieben.',
                'en' => 'Prime Burger grew out of a passion for good, honest food. We wanted to serve burgers that are truly fresh: no convenience products, no compromises. Today every burger is grilled to order with regionally sourced beef and ingredients you can taste. One bite and you know why we love burgers.',
            ]],
            ['key' => 'about_philosophy', 'group' => 'texts', 'value' => [
                'de' => 'Wir stehen für ehrliche Küche: ohne Tricks, ohne Zusätze, ohne Tiefkühlware. Unsere Burger sind so echt wie wir: frisch, saftig und voller Geschmack. Was uns besonders macht? Wir kochen nicht für Massen, sondern für Menschen.',
                'en' => 'We stand for honest cooking: no tricks, no additives, no frozen goods. Our burgers are as real as we are: fresh, juicy and full of flavour. What makes us different? We do not cook for the masses, we cook for people.',
            ]],
            ['key' => 'reservation_notice', 'group' => 'texts', 'value' => [
                'de' => 'Für Gruppen ab 6 Personen rufen Sie uns bitte kurz an, dann finden wir den passenden Tisch.',
                'en' => 'For groups of 6 or more, please give us a quick call so we can find the right table for you.',
            ]],
        ];

        foreach ($settings as $setting) {
            Setting::firstOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'group' => $setting['group'],
                    'type' => is_array($setting['value']) ? 'json' : 'string',
                ]
            );
        }
    }
}
