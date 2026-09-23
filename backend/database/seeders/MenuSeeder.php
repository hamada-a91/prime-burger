<?php

namespace Database\Seeders;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

/**
 * Seeds the complete Prime Burger menu (source: Speisekarte des Kunden, Stand September 2026).
 * Runs only when the menu is empty so admin edits are never overwritten.
 * Zum Neuimport: php artisan menu:refresh
 */
class MenuSeeder extends Seeder
{
    public function run(): void
    {
        if (MenuCategory::exists()) {
            return;
        }

        foreach ($this->menu() as $index => $category) {
            $model = MenuCategory::create([
                'name' => $category['name'],
                'description' => $category['description'] ?? null,
                'sort_order' => $index,
                'is_active' => true,
            ]);

            foreach ($category['items'] as $sort => $item) {
                MenuItem::create([
                    'category_id' => $model->id,
                    'name' => ['de' => $item[0], 'en' => $item[1] ?? $item[0]],
                    'price' => $item[2],
                    'description' => isset($item[3]) ? ['de' => $item[3], 'en' => $item[4] ?? $item[3]] : null,
                    'allergens' => $item[5] ?? [],
                    'tags' => $item[6] ?? [],
                    'variants' => $item[7] ?? null,
                    'price_note' => $item[8] ?? null,
                    'is_available' => true,
                    'sort_order' => $sort,
                ]);
            }
        }
    }

    /**
     * Item tuple: [name_de, name_en, price, desc_de, desc_en, allergens, tags, variants, price_note]
     */
    private function menu(): array
    {
        // Größen-Varianten, z. B. 0,2 l / 0,4 l
        $v = fn (array $sizes) => array_map(fn ($s) => [
            'label' => ['de' => $s[0], 'en' => $s[1]],
            'price' => $s[2],
        ], $sizes);

        // Standard-Kennzeichnung der Burger laut Karte
        $std = ['A', 'C', 'F', 'G', 'L', 'M', 'N'];
        $stdD = ['A', 'C', 'F', 'G', 'L', 'M', 'N', 'D'];

        return [
            [
                'name' => ['de' => 'Smash Burger', 'en' => 'Smash Burgers'],
                'description' => ['de' => 'Dünn gepresst, kross gebraten, doppelt saftig.', 'en' => 'Pressed thin, seared crisp, twice as juicy.'],
                'items' => [
                    ['Classic Smash', 'Classic Smash', 11.00, 'Smashed Beef Patty, Cheddar Käse, saure Gurke', 'Smashed beef patty, cheddar, pickles', $std],
                    ['Prime Smash', 'Prime Smash', 11.00, 'Smashed Beef Patty, gegrillte Tomaten und Zwiebeln, dazu Cheddar Käse', 'Smashed beef patty, grilled tomato and onions, cheddar', $std],
                    ['Bacon Smash', 'Bacon Smash', 11.40, 'Smashed Beef Patty, Bacon und Cheddar Käse', 'Smashed beef patty, bacon and cheddar', $std],
                ],
            ],
            [
                'name' => ['de' => 'Prime Specials', 'en' => 'Prime Specials'],
                'items' => [
                    ['Prime Steak Strips', 'Prime Steak Strips', 25.00, 'Zarte Hüftsteakstreifen, frisch angebraten mit Paprika, Zwiebeln, Knoblauch und frischem Koriander. Serviert mit knusprigen Pommes und unserer White BBQ Sauce.', 'Tender rump steak strips, seared with peppers, onions, garlic and fresh coriander. Served with crispy fries and our white BBQ sauce.', $std, ['signature']],
                    ['Spare Ribs', 'Spare Ribs', 21.00, 'Saftige Schweinerippchen mit Pommes frites, inklusive BBQ-Sauce als Dip', 'Juicy pork ribs with fries, BBQ sauce for dipping included', $std],
                ],
            ],
            [
                'name' => ['de' => 'Beef Burger', 'en' => 'Beef Burgers'],
                'description' => ['de' => 'Frisch gegrillt, erst wenn bestellt.', 'en' => 'Grilled fresh, only once ordered.'],
                'items' => [
                    ['Hamburger', 'Hamburger', 11.20, 'Beef Patty, karamellisierte Zwiebeln, saure Gurke, Tomate und Salat', 'Beef patty, caramelised onions, pickles, tomato and lettuce', $std],
                    ['Prime Cheese', 'Prime Cheese', 11.40, 'Beef Patty, Cheddar Käse, karamellisierte Zwiebeln, saure Gurke, Tomate und Salat', 'Beef patty, cheddar, caramelised onions, pickles, tomato and lettuce', $std],
                    ['Pickle Cheese', 'Pickle Cheese', 12.00, 'Beef Patty, Cheddar Käse, Redpeppajam Sauce, eingelegte Zwiebeln, Tomate und Salat', 'Beef patty, cheddar, red pepper jam, pickled onions, tomato and lettuce', $std],
                    ['Prime Bacon', 'Prime Bacon', 12.50, 'Beef Patty, Cheddar Käse, Bacon, White BBQ Sauce, Tomate und Salat', 'Beef patty, cheddar, bacon, white BBQ sauce, tomato and lettuce', $stdD],
                    ['BBQ Bacon', 'BBQ Bacon', 13.90, 'Beef Patty, Cheddar Käse, Zwiebelringe, Bacon, rauchige BBQ Sauce, Tomate und Salat', 'Beef patty, cheddar, onion rings, bacon, smoky BBQ sauce, tomato and lettuce', $stdD],
                    ['Prime Avocado', 'Prime Avocado', 13.60, 'Beef Patty, Cheddar Käse, Guacamole, Zwiebel, Tomate und Salat', 'Beef patty, cheddar, guacamole, onion, tomato and lettuce', $std],
                    ['Scrambled Avocado', 'Scrambled Avocado', 14.40, 'Beef Patty, Guacamole, Cheddar Käse, Zwiebel, Spiegelei, Tomate und Salat', 'Beef patty, guacamole, cheddar, onion, fried egg, tomato and lettuce', $std],
                    ['Scrambled Bacon', 'Scrambled Bacon', 13.80, 'Beef Patty, Cheddar Käse, Bacon, White BBQ Sauce, Spiegelei, Tomate und Salat', 'Beef patty, cheddar, bacon, white BBQ sauce, fried egg, tomato and lettuce', $std],
                    ['Prime Hot', 'Prime Hot', 13.20, 'Beef Patty, Cheddar Käse, Jalapeños, hausgemachte eingelegte Zwiebeln, Tomate und Salat', 'Beef patty, cheddar, jalapeños, homemade pickled onions, tomato and lettuce', $std, ['spicy']],
                    ['Schroom de Trüff', 'Schroom de Trüff', 14.00, 'Beef Patty, gegrillte Champignons mit Zwiebeln, Trüffel-Mayo, Tomate und Salat', 'Beef patty, grilled mushrooms with onions, truffle mayo, tomato and lettuce', $std],
                    ['Beef Shakshuka', 'Beef Shakshuka', 15.90, 'Beef Patty, hausgemachte Shakshuka, Koriander, Spiegelei, Lauchzwiebeln und Salat', 'Beef patty, homemade shakshuka, coriander, fried egg, spring onions and lettuce', $std],
                    ['Cheese Bomb', 'Cheese Bomb', 15.20, 'Beef Patty, Bacon, übergossen mit heißem Käse und getoppt mit Röstzwiebeln, Tomate und Salat', 'Beef patty, bacon, smothered in hot cheese and topped with crispy onions, tomato and lettuce', $std, ['signature']],
                    ['Double Cheese Bomb', 'Double Cheese Bomb', 22.40, 'Double Beef Patty, Bacon, übergossen mit heißem Käse und getoppt mit Röstzwiebeln, Tomate und Salat', 'Double beef patty, bacon, smothered in hot cheese and topped with crispy onions, tomato and lettuce', $std],
                    ['Triple Cheese Bomb', 'Triple Cheese Bomb', 27.00, 'Triple Beef Patty, Bacon, übergossen mit heißem Käse und getoppt mit Röstzwiebeln, Tomate und Salat', 'Triple beef patty, bacon, smothered in hot cheese and topped with crispy onions, tomato and lettuce', $std],
                    ['Pulled Beef Burger', 'Pulled Beef Burger', 15.90, 'Pulled Beef, Coleslaw, Zwiebeln, Tomate und Salat', 'Pulled beef, coleslaw, onions, tomato and lettuce', $stdD],
                    ['Cheesy Pulled Beef', 'Cheesy Pulled Beef', 15.90, 'Pulled Beef, Cheddar-Sauce, Zwiebeln, Tomate und Salat', 'Pulled beef, cheddar sauce, onions, tomato and lettuce', $std],
                    ['Prime Hawaii', 'Prime Hawaii', 14.50, 'Beef Patty, gegrillte Ananas, Bacon, karamellisierte Zwiebeln, Teriyaki Sauce und Salat', 'Beef patty, grilled pineapple, bacon, caramelised onions, teriyaki sauce and lettuce', $std],
                    ['Surf & Turf', 'Surf & Turf', 27.00, 'Hüftsteak, Garnelen, gegrillte Paprika, Zwiebeln, Tomate und Salat', 'Rump steak, prawns, grilled peppers, onions, tomato and lettuce', $stdD],
                    ['Sweet Devil', 'Sweet Devil', 20.00, 'Doppeltes Beef Patty, gegrillte Ananas, Zwiebeln, Jalapeños, geschmolzener Cheddar und Salat', 'Double beef patty, grilled pineapple, onions, jalapeños, melted cheddar and lettuce', $std, ['spicy']],
                    ['Chili Cheese', 'Chili Cheese', 20.00, 'Beef Patty, Chili con Carne, Käsesoße und Jalapeños, Tomate und Salat', 'Beef patty, chili con carne, cheese sauce and jalapeños, tomato and lettuce', $std, ['spicy']],
                    ['Rinderstreifen Burger', 'Beef Strips Burger', 21.00, 'Hüftsteakstreifen, karamellisierte Zwiebeln, Teriyaki Soße, Sesam und Salat', 'Rump steak strips, caramelised onions, teriyaki sauce, sesame and lettuce', $std],
                    ['Mac and Cheese', 'Mac and Cheese', 20.00, 'Beef Patty, Mac & Cheese, Röstzwiebeln, Lauchzwiebeln, Käse, Tomate und Salat', 'Beef patty, mac & cheese, crispy onions, spring onions, cheese, tomato and lettuce', $std],
                    ['The Big Prime', 'The Big Prime', 21.00, 'Double Beef Patty, Cheddar, BBQ Sauce, Zwiebelringe, Bacon, Tomate und Salat', 'Double beef patty, cheddar, BBQ sauce, onion rings, bacon, tomato and lettuce', $stdD],
                    ['The Real Big Prime', 'The Real Big Prime', 26.00, 'Triple Beef Patty, Cheddar, BBQ Sauce, Zwiebelringe, Bacon, Tomate und Salat', 'Triple beef patty, cheddar, BBQ sauce, onion rings, bacon, tomato and lettuce', $stdD, ['signature']],
                ],
            ],
            [
                'name' => ['de' => 'Chicken Burger', 'en' => 'Chicken Burgers'],
                'items' => [
                    ['Prime César', 'Prime César', 12.90, 'Frittiertes Hähnchenbrustfilet, César Sauce, Parmesan, Rucola, Tomate und Salat', 'Fried chicken breast fillet, Caesar sauce, parmesan, rocket, tomato and lettuce', $std],
                    ['Prime Italian', 'Prime Italian', 12.90, 'Hähnchenbrustfilet, Mozzarella, Rucola, Balsamico, Tomate und Salat', 'Chicken breast fillet, mozzarella, rocket, balsamic, tomato and lettuce', $std],
                    ['Prime Teriyaki', 'Prime Teriyaki', 12.90, 'Hähnchenbrustfilet, Ingwer, Koriander, Teriyaki Sauce, Wasabi Mayo, Tomate und Salat', 'Chicken breast fillet, ginger, coriander, teriyaki sauce, wasabi mayo, tomato and lettuce', $std],
                    ['Hot Chicken', 'Hot Chicken', 12.90, 'Hähnchenbrustfilet, Cheddar Sauce, Jalapeños, Tomate und Salat', 'Chicken breast fillet, cheddar sauce, jalapeños, tomato and lettuce', $std, ['spicy']],
                    ['Prime Chicken', 'Prime Chicken', 13.30, 'Frittiertes Hähnchenbrustfilet, Cheddar Käse, White BBQ Sauce, Coleslaw, Tomate und Salat', 'Fried chicken breast fillet, cheddar, white BBQ sauce, coleslaw, tomato and lettuce', $stdD],
                    ['Crispy Mac Chicken', 'Crispy Mac Chicken', 14.50, 'Frittiertes Hähnchenbrustfilet, Mac & Cheese, Röstzwiebeln, Lauchzwiebeln, Tomate und Salat', 'Fried chicken breast fillet, mac & cheese, crispy onions, spring onions, tomato and lettuce', $std],
                    ['Chicken Shakshuka', 'Chicken Shakshuka', 15.00, 'Hähnchenbrustfilet, hausgemachte Shakshuka, Koriander, Spiegelei, Lauchzwiebeln und Salat', 'Chicken breast fillet, homemade shakshuka, coriander, fried egg, spring onions and lettuce', $std],
                ],
            ],
            [
                'name' => ['de' => 'Vegane Burger', 'en' => 'Vegan Burgers'],
                'items' => [
                    ['Crunchy Kimchi', 'Crunchy Kimchi', 12.50, 'Crunchy Kimchi Patty, saure Gurke, Röstzwiebeln, Teriyaki Soße, Spinat, Tomate und Salat', 'Crunchy kimchi patty, pickles, crispy onions, teriyaki sauce, spinach, tomato and lettuce', $std, ['vegan']],
                    ['Butternut Squash', 'Butternut Squash', 12.60, 'Kürbis Patty, Redpeppajam Sauce, Zwiebelringe, Spinat, Tomate und Salat', 'Pumpkin patty, red pepper jam, onion rings, spinach, tomato and lettuce', $std, ['vegan']],
                    ['Umami Master', 'Umami Master', 13.00, 'Patty aus gegrillten Pilzen, vegane Trüffel-Mayo, karamellisierte Zwiebeln, Rucola, Tomate und Salat', 'Grilled mushroom patty, vegan truffle mayo, caramelised onions, rocket, tomato and lettuce', $std, ['vegan']],
                    ['Veggie Hawaii', 'Veggie Hawaii', 12.40, 'No Beef Patty, gegrillte Ananas, Teriyaki Soße, karamellisierte Zwiebeln und Salat', 'No-beef patty, grilled pineapple, teriyaki sauce, caramelised onions and lettuce', $std, ['vegan']],
                    ['Avocado Garten', 'Avocado Garden', 13.00, 'No Beef Patty, Guacamole, Zwiebeln, Tomate und Salat', 'No-beef patty, guacamole, onions, tomato and lettuce', $std, ['vegan']],
                    ['Prime Veggie', 'Prime Veggie', 12.50, 'No Beef Patty, vegane Trüffelmayonnaise, karamellisierte Zwiebeln, gegrilltes Gemüse, Tomate und Salat', 'No-beef patty, vegan truffle mayonnaise, caramelised onions, grilled vegetables, tomato and lettuce', $std, ['vegan']],
                ],
            ],
            [
                'name' => ['de' => 'Vegetarische Burger', 'en' => 'Vegetarian Burgers'],
                'items' => [
                    ['Cheese-Garten', 'Cheese Garden', 16.00, 'No Beef Patty, Mac & Cheese, Röstzwiebeln, Lauchzwiebeln, Tomate und Salat', 'No-beef patty, mac & cheese, crispy onions, spring onions, tomato and lettuce', $std, ['vegetarian']],
                    ['Green Shakshuka', 'Green Shakshuka', 15.60, 'No Beef Patty, hausgemachte Shakshuka, Spiegelei, Zwiebeln, Tomate und Salat', 'No-beef patty, homemade shakshuka, fried egg, onions, tomato and lettuce', $std, ['vegetarian']],
                    ['Hot-Garten', 'Hot Garden', 12.60, 'No Beef Patty, Cheddar Sauce, Jalapeños, karamellisierte Zwiebeln, Tomate und Salat', 'No-beef patty, cheddar sauce, jalapeños, caramelised onions, tomato and lettuce', $std, ['vegetarian', 'spicy']],
                ],
            ],
            [
                'name' => ['de' => 'Mexican Fusion Specials', 'en' => 'Mexican Fusion Specials'],
                'description' => [
                    'de' => 'Nach Originalrezept zubereitet. Unser Birria-Fleisch gart mehrere Stunden langsam, damit der Geschmack tief, saftig und intensiv wird. Inspiriert von echtem mexikanischem Streetfood.',
                    'en' => 'Made to an original recipe. Our birria beef is slow-cooked for hours for a deep, juicy and intense flavour. Inspired by real Mexican street food.',
                ],
                'items' => [
                    ['Birria Tacos', 'Birria Tacos', 4.00, 'Soft Tacos gefüllt mit langsam gegartem Pulled Beef, geschmolzenem Mozzarella, frischem Koriander und Zwiebeln. Dazu unsere aromatische Birria-Brühe zum Dippen.', 'Soft tacos filled with slow-cooked pulled beef, melted mozzarella, fresh coriander and onions. Served with our aromatic birria broth for dipping.', ['C', 'F', 'G', 'L', 'M', 'N'], ['new'], null, ['de' => 'Preis pro Stück. Als Hauptgericht empfehlen wir 3 Stück.', 'en' => 'Price per piece. We recommend 3 pieces as a main course.']],
                    ['Birria Ramen', 'Birria Ramen', 12.50, 'Ramen-Nudeln mit langsam gegartem Pulled Beef in unserer hausgemachten Birria-Brühe. Verfeinert mit Mozzarella, frischem Koriander und Zwiebeln.', 'Ramen noodles with slow-cooked pulled beef in our homemade birria broth. Finished with mozzarella, fresh coriander and onions.', $std, ['new']],
                    ['Birria Quesadilla', 'Birria Quesadilla', 13.00, 'Quesadilla gefüllt mit langsam gegartem Pulled Beef, geschmolzenem Mozzarella, frischem Koriander, Tomate und Zwiebeln.', 'Quesadilla filled with slow-cooked pulled beef, melted mozzarella, fresh coriander, tomato and onions.', ['A', 'F', 'G', 'L', 'M', 'N'], ['new']],
                ],
            ],
            [
                'name' => ['de' => 'Finger Food', 'en' => 'Finger Food'],
                'items' => [
                    ['Pommes', 'Fries', 5.50, null, null, ['A']],
                    ['Patatas Bravas', 'Patatas Bravas', 6.00, 'Mit roter Salsa', 'With red salsa', ['A']],
                    ['Pommes mit Parmesan und Trüffel-Mayo', 'Fries with Parmesan and Truffle Mayo', 7.30, null, null, ['A']],
                    ['Avocado Fries', 'Avocado Fries', 7.30, 'Mit Guacamole, Tomate, Zwiebeln und Koriander', 'With guacamole, tomato, onions and coriander', ['A']],
                    ['Süßkartoffel Pommes', 'Sweet Potato Fries', 7.30, null, null, ['A']],
                    ['Hot Cheddar Fries', 'Hot Cheddar Fries', 7.10, 'Mit Cheddar Sauce und Jalapeños', 'With cheddar sauce and jalapeños', ['A', 'G', 'O'], ['spicy']],
                    ['Bacon Fries', 'Bacon Fries', 8.90, 'Mit Cheddar Sauce und Bacon', 'With cheddar sauce and bacon', ['A', 'G']],
                    ['Mac & Cheese Fries', 'Mac & Cheese Fries', 8.90, null, null, ['A', 'G'], [], null, ['de' => 'Mit Süßkartoffelpommes +2,30 €', 'en' => 'With sweet potato fries +2.30 €']],
                    ['Chili con Carne Fries', 'Chili con Carne Fries', 9.30, null, null, ['A', 'G', 'O'], ['spicy'], null, ['de' => 'Mit Süßkartoffelpommes +2,30 €', 'en' => 'With sweet potato fries +2.30 €']],
                    ['Shakshuka Fries', 'Shakshuka Fries', 8.90, 'Mit hausgemachter Shakshuka, Mozzarella, Spiegelei und Lauchzwiebeln', 'With homemade shakshuka, mozzarella, fried egg and spring onions', ['A', 'C', 'G']],
                    ['Pulled Beef Fries', 'Pulled Beef Fries', 9.30, 'Mit Pulled Beef, BBQ Sauce und Zwiebeln', 'With pulled beef, BBQ sauce and onions', ['A', 'M', 'D']],
                    ['Zwiebelringe (6 Stück)', 'Onion Rings (6 pcs.)', 5.90, null, null, ['A', 'F', 'M', 'L']],
                    ['Chicken Fingers Tikka (5 Stück)', 'Chicken Fingers Tikka (5 pcs.)', 8.00, null, null, ['A', 'C', 'E', 'F', 'G', 'L', 'M', 'N']],
                    ['Prime Mozzarella Sticks (5 Stück)', 'Prime Mozzarella Sticks (5 pcs.)', 6.00, null, null, ['A', 'C', 'F', 'G', 'L', 'M', 'N']],
                    ['Mac & Cheese Bites (5 Stück)', 'Mac & Cheese Bites (5 pcs.)', 5.50, null, null, ['A', 'F', 'G', 'L', 'M', 'N']],
                    ['Pulled Pork Bites (5 Stück)', 'Pulled Pork Bites (5 pcs.)', 5.90, null, null, ['A', 'C', 'D', 'F', 'G', 'L', 'M', 'N']],
                    ['Prime Chicken Wings (5 Stück)', 'Prime Chicken Wings (5 pcs.)', 6.50, null, null, ['A', 'C', 'E', 'F', 'G', 'L', 'M', 'N']],
                ],
            ],
            [
                'name' => ['de' => 'Soßen & Dips', 'en' => 'Sauces & Dips'],
                'items' => [
                    ['Hausgemachte Avocado Creme', 'Homemade Avocado Cream', 2.00],
                    ['Trüffel-Mayo', 'Truffle Mayo', 2.00],
                    ['Cheddar Sauce', 'Cheddar Sauce', 1.50, null, null, ['G']],
                    ['Mango Dip', 'Mango Dip', 1.50],
                    ['Knoblauch Sauce', 'Garlic Sauce', 1.50],
                    ['Redpeppajam', 'Red Pepper Jam', 1.50],
                    ['White BBQ Sauce', 'White BBQ Sauce', 1.50, null, null, ['D']],
                ],
            ],
            [
                'name' => ['de' => 'Milchshakes', 'en' => 'Milkshakes'],
                'description' => ['de' => 'Alle Milchshakes werden frisch zubereitet und mit Sahne serviert.', 'en' => 'All milkshakes are made fresh and served with cream.'],
                'items' => [
                    ['Kokos-Hibiskus Shake', 'Coconut Hibiscus Shake', 7.50, 'Fruchtig-blumige Hibiskusnote, kombiniert mit cremiger Kokosmilch', 'Fruity, floral hibiscus combined with creamy coconut milk', ['G', 'P']],
                    ['Quark-Orange Shake', 'Quark Orange Shake', 7.50, 'Erfrischend cremig mit einer leichten Säure aus Orange und der Besonderheit von Quark', 'Refreshingly creamy with a light orange tang and the character of quark', ['G', 'P']],
                    ['Dubai-Schokolade Shake', 'Dubai Chocolate Shake', 7.50, 'Intensiv schokoladig mit einer luxuriösen, cremigen Textur', 'Intensely chocolatey with a luxurious, creamy texture', ['G', 'P']],
                    ['Topping: Pancakes', 'Topping: Pancakes', 5.00, null, null, ['A', 'C', 'G'], [], null, ['de' => 'Aufpreis je Topping', 'en' => 'Surcharge per topping']],
                    ['Topping: Churros', 'Topping: Churros', 5.00, null, null, ['A', 'C', 'G'], [], null, ['de' => 'Aufpreis je Topping', 'en' => 'Surcharge per topping']],
                ],
            ],
            [
                'name' => ['de' => 'Desserts', 'en' => 'Desserts'],
                'items' => [
                    ['Churros', 'Churros', 7.50, 'Knusprig goldbraun gebacken, verfeinert mit Zucker und Zimt, serviert mit cremigem Schokodip und frischer Sahne', 'Baked crisp and golden, dusted with sugar and cinnamon, served with a creamy chocolate dip and fresh cream', ['A', 'C', 'G']],
                    ['Pancakes', 'Pancakes', 7.50, 'Fluffige Pancakes, serviert mit süßem Ahornsirup und frischer Sahne', 'Fluffy pancakes, served with sweet maple syrup and fresh cream', ['A', 'C', 'G']],
                ],
            ],
            [
                'name' => ['de' => 'Alkoholfreie Getränke', 'en' => 'Soft Drinks'],
                'items' => [
                    ['Coca-Cola, Coca-Cola Zero, Fanta, Sprite, Spezi', 'Coca-Cola, Coca-Cola Zero, Fanta, Sprite, Spezi', null, null, null, [], [], $v([['0,2 l', '0.2 l', 3.20], ['0,4 l', '0.4 l', 4.90]])],
                    ['Fritz-Limo', 'Fritz-Limo', null, 'Zitrone, Honigmelone', 'Lemon, honeydew melon', [], [], $v([['0,33 l', '0.33 l', 4.50]])],
                    ['VIO Wasser (still / medium)', 'VIO Water (still / sparkling)', null, null, null, [], [], $v([['0,25 l', '0.25 l', 2.90], ['0,75 l', '0.75 l', 7.10]])],
                    ['Eistee', 'Iced Tea', null, 'Schwarztee Pfirsich, Zitrone', 'Black tea peach, lemon', [], [], $v([['0,25 l', '0.25 l', 4.50]])],
                    ['Schweppes', 'Schweppes', null, 'Lemon, Tonic Water, Ginger Ale, Russian Wildberry', 'Lemon, Tonic Water, Ginger Ale, Russian Wildberry', [], [], $v([['0,2 l', '0.2 l', 3.20], ['0,4 l', '0.4 l', 4.90]])],
                    ['Red Bull', 'Red Bull', null, 'Verschiedene Sorten', 'Various flavours', [], [], $v([['0,25 l', '0.25 l', 4.90]])],
                    ['Säfte & Nektare von Niehoffs', 'Niehoffs Juices & Nectars', null, 'Apfel, Orange, Mango (auch als Schorle)', 'Apple, orange, mango (also as a spritzer)', [], [], $v([['0,2 l', '0.2 l', 3.40], ['0,4 l', '0.4 l', 5.40]])],
                    ['Handmade Limonade', 'Handmade Lemonade', null, 'Gurke-Limette, Melone-Ingwer, Rhabarber-Erdbeer, Mango-Limette', 'Cucumber-lime, melon-ginger, rhubarb-strawberry, mango-lime', [], [], $v([['0,5 l', '0.5 l', 6.20]])],
                ],
            ],
            [
                'name' => ['de' => 'Hot Drinks', 'en' => 'Hot Drinks'],
                'items' => [
                    ['Kaffee', 'Coffee', null, null, null, [], [], $v([['klein', 'small', 2.95], ['groß', 'large', 4.90]])],
                    ['Milchkaffee', 'Café au Lait', 3.95, null, null, ['G']],
                    ['Espresso', 'Espresso', 2.90],
                    ['Cappuccino', 'Cappuccino', 3.90, null, null, ['G']],
                    ['Latte Macchiato', 'Latte Macchiato', 4.90, null, null, ['G']],
                    ['Kakao', 'Hot Chocolate', 4.60, null, null, ['G']],
                    ['Tee', 'Tea', 3.80, 'Diverse Sorten', 'Various kinds'],
                ],
            ],
            [
                'name' => ['de' => 'Bier', 'en' => 'Beer'],
                'items' => [
                    ['Ur-Krostitzer vom Fass', 'Ur-Krostitzer on Tap', null, null, null, ['A'], [], $v([['0,3 l', '0.3 l', 4.20], ['0,5 l', '0.5 l', 5.90]])],
                    ['Guinness Hop House 13 Lager', 'Guinness Hop House 13 Lager', null, null, null, ['A'], [], $v([['0,33 l', '0.33 l', 4.50]])],
                    ['Desperados', 'Desperados', null, null, null, ['A'], [], $v([['0,33 l', '0.33 l', 4.50]])],
                    ['Schöfferhofer hell / dunkel / alkoholfrei', 'Schöfferhofer light / dark / non-alcoholic', null, null, null, ['A'], [], $v([['0,5 l', '0.5 l', 5.90]])],
                    ['Radler / Diesel', 'Radler / Diesel', null, null, null, ['A'], [], $v([['0,3 l', '0.3 l', 4.20], ['0,5 l', '0.5 l', 4.90]])],
                    ['Pils alkoholfrei', 'Non-alcoholic Pils', null, null, null, ['A'], [], $v([['0,3 l', '0.3 l', 4.20]])],
                ],
            ],
            [
                'name' => ['de' => 'Wein', 'en' => 'Wine'],
                'items' => [
                    ['Hauswein rot (trocken), weiß, rosé', 'House Wine red (dry), white, rosé', null, null, null, [], [], $v([['0,2 l', '0.2 l', 5.90], ['0,75 l', '0.75 l', 23.50]])],
                    ['Weinschorle', 'Wine Spritzer', null, null, null, [], [], $v([['0,2 l', '0.2 l', 5.90]])],
                ],
            ],
            [
                'name' => ['de' => 'Aperitifs', 'en' => 'Aperitifs'],
                'items' => [
                    ['Melone Spritz', 'Melon Spritz', 8.50],
                    ['Aperol Spritz', 'Aperol Spritz', 8.50],
                    ['Wild Berry Lillet', 'Wild Berry Lillet', 8.50],
                    ['Campari Orange / Amalfi / Soda', 'Campari Orange / Amalfi / Soda', 8.50],
                ],
            ],
            [
                'name' => ['de' => 'Longdrinks', 'en' => 'Long Drinks'],
                'items' => [
                    ['Russian Standard Vodka Energy / Orange / Lemon', 'Russian Standard Vodka Energy / Orange / Lemon', 8.50],
                    ['Tanqueray Gin Tonic', 'Tanqueray Gin & Tonic', 9.80],
                    ['Tanqueray Spritz / Orange', 'Tanqueray Spritz / Orange', 9.80],
                    ['Jim Beam Cola', 'Jim Beam & Cola', 8.50],
                    ['Havana Cola', 'Havana & Cola', 8.50],
                ],
            ],
            [
                'name' => ['de' => 'Liköre & Kräuter', 'en' => 'Liqueurs & Herbal Spirits'],
                'items' => [
                    ['Saure Kirsche, Pfeffi', 'Sour Cherry, Pfeffi', null, null, null, [], [], $v([['4 cl', '4 cl', 3.20]])],
                    ['Jägermeister, Ramazzotti, Sambuca, Baileys', 'Jägermeister, Ramazzotti, Sambuca, Baileys', null, null, null, [], [], $v([['4 cl', '4 cl', 4.00]])],
                ],
            ],
        ];
    }
}
