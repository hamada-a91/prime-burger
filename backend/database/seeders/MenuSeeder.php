<?php

namespace Database\Seeders;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

/**
 * Seeds the complete Prime Burger menu (source: material/inhalte-alte-webseite.md).
 * Runs only when the menu is empty so admin edits are never overwritten.
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
        $v = fn (array $sizes) => array_map(fn ($s) => [
            'label' => ['de' => $s[0], 'en' => $s[1]],
            'price' => $s[2],
        ], $sizes);

        return [
            [
                'name' => ['de' => 'Smash Burger', 'en' => 'Smash Burgers'],
                'description' => ['de' => 'Dünn gepresst, kross gebraten, doppelt saftig.', 'en' => 'Pressed thin, seared crisp, twice as juicy.'],
                'items' => [
                    ['Classic Smash', 'Classic Smash', 11.00, 'Smashed Beef Patty, Cheddar Käse, saure Gurke', 'Smashed beef patty, cheddar, pickles', ['N', 'A', 'C', 'G', 'M']],
                    ['Prime Smash', 'Prime Smash', 11.00, 'Smashed Beef Patty, Tomaten und Zwiebeln, dazu Cheddar Käse', 'Smashed beef patty, tomato and onion, cheddar', ['N', 'A', 'C', 'G', 'M']],
                    ['Bacon Smash', 'Bacon Smash', 11.40, 'Smashed Beef Patty, Bacon und Cheddar Käse', 'Smashed beef patty, bacon and cheddar', ['N', 'A', 'C', 'G', 'M']],
                ],
            ],
            [
                'name' => ['de' => 'Beef Burger', 'en' => 'Beef Burgers'],
                'description' => ['de' => 'Rindfleisch aus regionaler Herkunft, frisch gegrillt.', 'en' => 'Regionally sourced beef, grilled fresh to order.'],
                'items' => [
                    ['Hamburger', 'Hamburger', 10.40, 'Beef Patty, karamellisierte Zwiebeln, saure Gurke, Tomate und Salat', 'Beef patty, caramelised onions, pickles, tomato and lettuce', ['N', 'A', 'C', 'G', 'M']],
                    ['Prime Cheese', 'Prime Cheese', 11.40, 'Beef Patty, Cheddar Käse, karamellisierte Zwiebeln, saure Gurke, Tomate und Salat', 'Beef patty, cheddar, caramelised onions, pickles, tomato and lettuce', ['N', 'A', 'C', 'G', 'M']],
                    ['Pickle Cheese', 'Pickle Cheese', 11.50, 'Beef Patty, Cheddar Käse, eingelegte Zwiebeln, Tomate und Salat', 'Beef patty, cheddar, pickled onions, tomato and lettuce', ['N', 'A', 'C', 'G', 'M']],
                    ['Prime Bacon', 'Prime Bacon', 12.50, 'Beef Patty, Cheddar Käse, Bacon, Tomate und Salat', 'Beef patty, cheddar, bacon, tomato and lettuce', ['N', 'A', 'C', 'G', 'M']],
                    ['BBQ Bacon', 'BBQ Bacon', 13.90, 'Beef Patty, Cheddar Käse, Zwiebelringe, Bacon, rauchige Barbecuesoße, Tomate und Salat', 'Beef patty, cheddar, onion rings, bacon, smoky barbecue sauce, tomato and lettuce', ['N', 'A', 'C', 'G', 'M', 'L']],
                    ['Prime Avocado', 'Prime Avocado', 13.00, 'Beef Patty, Guacamole, Zwiebel, Tomate und Salat', 'Beef patty, guacamole, onion, tomato and lettuce', ['N', 'A', 'C', 'G', 'M']],
                    ['Scrambled Avocado', 'Scrambled Avocado', 13.80, 'Beef Patty, Guacamole, Cheddar Käse, Zwiebel, Spiegelei, Tomate und Salat', 'Beef patty, guacamole, cheddar, onion, fried egg, tomato and lettuce', ['N', 'A', 'C', 'G', 'M']],
                    ['Scrambled Bacon', 'Scrambled Bacon', 13.00, 'Beef Patty, Cheddar Käse, Bacon, Spiegelei, Tomate und Salat', 'Beef patty, cheddar, bacon, fried egg, tomato and lettuce', ['N', 'A', 'C', 'G', 'M']],
                    ['Prime Hot', 'Prime Hot', 12.60, 'Beef Patty, Cheddar Käse, Jalapeños, eingelegte Zwiebeln, Tomate und Salat', 'Beef patty, cheddar, jalapeños, pickled onions, tomato and lettuce', ['N', 'A', 'C', 'G', 'M', 'O'], ['spicy']],
                    ['Schroom de Trüff', 'Schroom de Trüff', 13.80, 'Beef Patty, gegrillte Champignons mit Zwiebeln, Trüffel-Mayo, Tomate und Salat', 'Beef patty, grilled mushrooms with onions, truffle mayo, tomato and lettuce', ['N', 'A', 'C', 'G', 'M']],
                    ['Beef Shakshuka', 'Beef Shakshuka', 15.90, 'Beef Patty, hausgemachte Shakshuka, Spiegelei, Lauchzwiebeln und Salat', 'Beef patty, homemade shakshuka, fried egg, spring onions and lettuce', ['N', 'A', 'C', 'G', 'M']],
                    ['Cheese Bomb', 'Cheese Bomb', 15.00, 'Beef Patty, Bacon und karamellisierte Zwiebeln, übergossen mit heißem Käse und getoppt mit Röstzwiebeln', 'Beef patty, bacon and caramelised onions, smothered in hot cheese and topped with crispy onions', ['N', 'A', 'C', 'G', 'M'], ['signature']],
                    ['Double Cheese Bomb', 'Double Cheese Bomb', 20.00, 'Double Beef Patty, Bacon und karamellisierte Zwiebeln, übergossen mit heißem Käse und getoppt mit Röstzwiebeln', 'Double beef patty, bacon and caramelised onions, smothered in hot cheese and topped with crispy onions', ['N', 'A', 'C', 'G', 'M']],
                    ['Pulled Pork', 'Pulled Pork', 15.60, 'Pulled Pork mit Barbecuesoße, Krautsalat, Zwiebeln, Tomate und Salat', 'Pulled pork with barbecue sauce, coleslaw, onions, tomato and lettuce', ['N', 'A', 'C', 'G', 'M']],
                    ['Cheesy Pulled Pork', 'Cheesy Pulled Pork', 15.60, 'Pulled Pork mit Barbecue Sauce, Cheddar-Sauce, Zwiebeln, Tomate und Salat', 'Pulled pork with barbecue sauce, cheddar sauce, onions, tomato and lettuce', ['N', 'A', 'C', 'G', 'M']],
                    ['Prime Hawaii', 'Prime Hawaii', 14.00, 'Beef Patty, gegrillte Ananas, Bacon, karamellisierte Zwiebeln und Teriyaki Sauce', 'Beef patty, grilled pineapple, bacon, caramelised onions and teriyaki sauce', ['N', 'A', 'C', 'G', 'F', 'M', 'L']],
                    ['Surf & Turf', 'Surf & Turf', 25.00, 'Hüftsteak, Garnelen, hausgemachte Salsa, gegrillte Paprika und Zwiebeln', 'Rump steak, prawns, homemade salsa, grilled peppers and onions', ['N', 'A', 'C', 'G', 'B', 'M']],
                    ['Chili Cheese', 'Chili Cheese', 18.00, 'Beef Patty, Chili con Carne, Käsesoße und Jalapeños, Tomate und Salat', 'Beef patty, chili con carne, cheese sauce and jalapeños, tomato and lettuce', ['N', 'A', 'C', 'G', 'M', 'O'], ['spicy']],
                    ['Mac and Cheese', 'Mac and Cheese', 17.00, 'Beef Patty, Maccheroni, Röstzwiebeln, Lauchzwiebeln, Käse, Tomate und Salat', 'Beef patty, macaroni, crispy onions, spring onions, cheese, tomato and lettuce', ['N', 'A', 'C', 'G', 'M']],
                    ['The Big Prime', 'The Big Prime', 21.00, 'Double Beef Patty, Cheddar, Barbecue Sauce, Zwiebelringe und Bacon, Tomate und Salat', 'Double beef patty, cheddar, barbecue sauce, onion rings and bacon, tomato and lettuce', ['N', 'A', 'C', 'G', 'M', 'D', 'L']],
                    ['The Real Big Prime', 'The Real Big Prime', 25.00, 'Triple Beef Patty, Cheddar, Barbecue Sauce, Zwiebelringe und Bacon, Tomate und Salat', 'Triple beef patty, cheddar, barbecue sauce, onion rings and bacon, tomato and lettuce', ['N', 'A', 'C', 'G', 'M', 'D', 'L'], ['signature']],
                ],
            ],
            [
                'name' => ['de' => 'Chicken Burger', 'en' => 'Chicken Burgers'],
                'items' => [
                    ['Prime César', 'Prime César', 11.50, 'Frittiertes Hähnchenbrustfilet, César Sauce, Parmesan, Rucola, Tomate und Salat', 'Fried chicken breast fillet, Caesar sauce, parmesan, rocket, tomato and lettuce', ['A', 'G', 'M']],
                    ['Prime Italian', 'Prime Italian', 12.50, 'Hähnchenbrustfilet, Mozzarella, Rucola, Balsamico, Tomate und Salat', 'Chicken breast fillet, mozzarella, rocket, balsamic, tomato and lettuce', ['A', 'G', 'M']],
                    ['Prime Teriyaki', 'Prime Teriyaki', 12.50, 'Hähnchenbrustfilet, Ingwer, Koriander, Teriyaki Sauce, Wasabi Mayo, Tomate und Salat', 'Chicken breast fillet, ginger, coriander, teriyaki sauce, wasabi mayo, tomato and lettuce', ['A', 'F', 'G', 'M', 'L']],
                    ['Hot Chicken', 'Hot Chicken', 12.50, 'Hähnchenbrustfilet, Cheddar Käse, Jalapeños, Tomaten und Salat', 'Chicken breast fillet, cheddar, jalapeños, tomato and lettuce', ['A', 'C', 'F', 'G', 'M', 'N', 'O'], ['spicy']],
                ],
            ],
            [
                'name' => ['de' => 'Vegane Burger', 'en' => 'Vegan Burgers'],
                'description' => ['de' => 'Mit Not-Beef-Patty. Komplett pflanzlich.', 'en' => 'Made with a Not-Beef patty. Entirely plant-based.'],
                'items' => [
                    ['Prime Veggie', 'Prime Veggie', 12.50, 'Not Beef Patty, Hummus, karamellisierte Zwiebeln, gegrilltes Gemüse, Tomate und Salat', 'Not-Beef patty, hummus, caramelised onions, grilled vegetables, tomato and lettuce', ['A', 'C', 'F', 'G', 'M', 'N'], ['vegan']],
                    ['Avocado Garten', 'Avocado Garden', 13.00, 'Not Beef Patty, Guacamole, Zwiebel, Tomate und Salat', 'Not-Beef patty, guacamole, onion, tomato and lettuce', ['A', 'C', 'F', 'G', 'M', 'N'], ['vegan']],
                    ['Veggie Hawaii', 'Veggie Hawaii', 12.40, 'Not Beef Patty, gegrillte Ananas, Teriyaki Soße, karamellisierte Zwiebeln und Salat', 'Not-Beef patty, grilled pineapple, teriyaki sauce, caramelised onions and lettuce', ['A', 'C', 'F', 'G', 'M', 'N', 'L'], ['vegan']],
                ],
            ],
            [
                'name' => ['de' => 'Vegetarische Burger', 'en' => 'Vegetarian Burgers'],
                'items' => [
                    ['Cheese-Garten', 'Cheese Garden', 16.00, 'Not Beef Patty, hausgemachte Maccheroni & Käse, Röstzwiebel, Lauchzwiebel, Tomate und Salat', 'Not-Beef patty, homemade mac & cheese, crispy onions, spring onions, tomato and lettuce', ['A', 'C', 'F', 'G', 'M', 'N'], ['vegetarian']],
                    ['Hot-Garten', 'Hot Garden', 12.60, 'Not Beef Patty, Cheddar Sauce, Jalapeños, karamellisierte Zwiebeln, Tomaten und Salat', 'Not-Beef patty, cheddar sauce, jalapeños, caramelised onions, tomato and lettuce', ['A', 'C', 'F', 'G', 'M', 'N', 'O'], ['vegetarian', 'spicy']],
                    ['Trüffel-Garten', 'Truffle Garden', 13.80, 'Not Beef Patty, gegrillte Champignons mit Zwiebeln, Trüffel-Mayonnaise, Tomaten und Salat', 'Not-Beef patty, grilled mushrooms with onions, truffle mayonnaise, tomato and lettuce', ['A', 'C', 'F', 'G', 'M', 'N'], ['vegetarian']],
                ],
            ],
            [
                'name' => ['de' => 'Tacos & Burritos', 'en' => 'Tacos & Burritos'],
                'items' => [
                    ['Pulled Pork Tacos', 'Pulled Pork Tacos', 12.50, 'Zartes Pulled Pork mit Zwiebeln, frischer Koriander, BBQ-Sauce und Mozzarella', 'Tender pulled pork with onions, fresh coriander, BBQ sauce and mozzarella', ['A', 'C', 'G', 'M', 'D']],
                    ['Hähnchen Tacos', 'Chicken Tacos', 13.00, 'Hähnchenfleisch mit Tomaten, Zwiebel, Paprika, Knoblauch und Koriander', 'Chicken with tomato, onion, peppers, garlic and coriander', ['A', 'C', 'G']],
                    ['Garnelen Tacos', 'Prawn Tacos', 13.60, 'Garnelen mit Tomaten, Zwiebel, Paprika, Knoblauch und Koriander', 'Prawns with tomato, onion, peppers, garlic and coriander', ['A', 'C', 'G', 'B', 'R', 'D']],
                    ['Hüftsteak Tacos', 'Rump Steak Tacos', 14.70, 'Hüftsteak-Streifen mit Tomaten, Zwiebel, Paprika, Knoblauch und Koriander', 'Strips of rump steak with tomato, onion, peppers, garlic and coriander', ['A', 'C', 'G']],
                    ['Green Heroes Tacos', 'Green Heroes Tacos', 13.00, 'Vegane Füllung mit Tomaten, Zwiebeln, Paprika, Knoblauch und Koriander', 'Vegan filling with tomato, onion, peppers, garlic and coriander', ['A', 'C', 'G'], ['vegan']],
                    ['Burrito', 'Burrito', 12.90, 'Fleisch nach Wahl (Hähnchen, Pulled Pork oder vegetarisch), gefüllt mit Bohnen, Zwiebeln, Tomaten, frischem Koriander, Guacamole und Käse. Auf Wunsch mit Chili-Pulver.', 'Your choice of chicken, pulled pork or vegetarian, filled with beans, onions, tomato, fresh coriander, guacamole and cheese. Chili powder on request.', ['A', 'C', 'G', 'M'], [], null, ['de' => 'Mit Hüftsteak +3,50 €', 'en' => 'With rump steak +3.50 €']],
                ],
            ],
            [
                'name' => ['de' => 'Quesadilla', 'en' => 'Quesadilla'],
                'items' => [
                    ['Fiesta Quesadilla', 'Fiesta Quesadilla', 12.50, 'Hähnchenstreifen oder Hackfleisch, Shakshuka, Kartoffeln und Käse', 'Chicken strips or minced beef, shakshuka, potatoes and cheese', ['A', 'C', 'M', 'N']],
                ],
            ],
            [
                'name' => ['de' => 'Finger Food', 'en' => 'Finger Food'],
                'items' => [
                    ['Pommes', 'French Fries', 5.50, null, null, ['A']],
                    ['Süßkartoffel Pommes', 'Sweet Potato Fries', 7.30, null, null, ['A']],
                    ['Crunchy Petals', 'Crunchy Petals', 7.30, 'Mit Guacamole, Tomate, Zwiebeln und Koriander', 'With guacamole, tomato, onions and coriander', ['A']],
                    ['Loaded Steak Petals', 'Loaded Steak Petals', 10.00, 'Hüftsteak mit Guacamole, Tomate, Zwiebeln und Koriander', 'Rump steak with guacamole, tomato, onions and coriander', ['A']],
                    ['Hot Cheddar Fries', 'Hot Cheddar Fries', 7.10, 'Mit Cheddar Sauce und Jalapeños', 'With cheddar sauce and jalapeños', ['A', 'G', 'O'], ['spicy']],
                    ['Bacon Fries', 'Bacon Fries', 8.90, 'Mit Cheddar Sauce und Bacon', 'With cheddar sauce and bacon', ['A', 'G']],
                    ['Mac & Cheese Fries', 'Mac & Cheese Fries', 8.90, null, null, ['A', 'G'], [], null, ['de' => 'Mit Süßkartoffelpommes +2,30 €', 'en' => 'With sweet potato fries +2.30 €']],
                    ['Chili con Carne Fries', 'Chili con Carne Fries', 9.30, null, null, ['A', 'G', 'O'], ['spicy'], null, ['de' => 'Mit Süßkartoffelpommes +2,30 €', 'en' => 'With sweet potato fries +2.30 €']],
                    ['Shakshuka Fries', 'Shakshuka Fries', 8.90, 'Mit hausgemachter Shakshuka, Spiegelei und Lauchzwiebeln', 'With homemade shakshuka, fried egg and spring onions', ['A', 'C', 'G']],
                    ['Pulled Pork Fries', 'Pulled Pork Fries', 9.30, 'Mit Pulled Pork, BBQ Sauce und Zwiebeln', 'With pulled pork, BBQ sauce and onions', ['A', 'M']],
                    ['Zwiebelringe (6 Stk.)', 'Onion Rings (6 pcs.)', 5.90, null, null, ['A', 'L']],
                ],
            ],
            [
                'name' => ['de' => 'Soßen & Dips', 'en' => 'Sauces & Dips'],
                'items' => [
                    ['Hausgemachte Guacamole', 'Homemade Guacamole', 2.00],
                    ['Trüffel-Mayo', 'Truffle Mayo', 2.00],
                    ['Cheddar Sauce', 'Cheddar Sauce', 1.50],
                ],
            ],
            [
                'name' => ['de' => 'Alkoholfreie Getränke', 'en' => 'Soft Drinks'],
                'items' => [
                    ['Coca-Cola, Coca-Cola Zero, Fanta, Sprite, Spezi', 'Coca-Cola, Coca-Cola Zero, Fanta, Sprite, Spezi', null, null, null, [], [], $v([['0,2 l', '0.2 l', 3.20], ['0,4 l', '0.4 l', 4.90]])],
                    ['VIO Wasser (still / medium)', 'VIO Water (still / sparkling)', null, null, null, [], [], $v([['0,25 l', '0.25 l', 2.90], ['0,75 l', '0.75 l', 7.10]])],
                    ['Schweppes', 'Schweppes', null, 'Lemon, Tonic Water, Ginger Ale, Russian Wildberry', 'Lemon, Tonic Water, Ginger Ale, Russian Wildberry', [], [], $v([['0,2 l', '0.2 l', 3.20], ['0,4 l', '0.4 l', 4.90]])],
                    ['Red Bull', 'Red Bull', null, null, null, [], [], $v([['0,25 l', '0.25 l', 4.90]])],
                    ['Säfte & Nektare von Niehoffs', 'Niehoffs Juices & Nectars', null, 'Apfel, Orange, Mango-Schorle', 'Apple, orange, mango spritzer', [], [], $v([['0,2 l', '0.2 l', 3.40], ['0,4 l', '0.4 l', 5.40]])],
                    ['Handmade Limonade', 'Handmade Lemonade', null, 'Gurke-Limette, Melone-Ingwer, Rhabarber-Erdbeer, Mango-Limette', 'Cucumber-lime, melon-ginger, rhubarb-strawberry, mango-lime', [], [], $v([['0,5 l', '0.5 l', 6.20]])],
                ],
            ],
            [
                'name' => ['de' => 'Bier, Wein & Spirituosen', 'en' => 'Beer, Wine & Spirits'],
                'items' => [
                    ['Ur-Krostitzer vom Fass', 'Ur-Krostitzer on Tap', null, null, null, [], [], $v([['0,3 l', '0.3 l', 4.20], ['0,5 l', '0.5 l', 5.90]])],
                    ['Desperados', 'Desperados', null, null, null, [], [], $v([['0,33 l', '0.33 l', 4.50]])],
                    ['Schöfferhofer hell / dunkel / alkoholfrei', 'Schöfferhofer light / dark / non-alcoholic', null, null, null, [], [], $v([['0,5 l', '0.5 l', 5.90]])],
                    ['Radler / Diesel', 'Radler / Diesel', null, null, null, [], [], $v([['0,3 l', '0.3 l', 4.20], ['0,5 l', '0.5 l', 4.90]])],
                    ['Pils alkoholfrei', 'Non-alcoholic Pils', null, null, null, [], [], $v([['0,3 l', '0.3 l', 4.20]])],
                    ['Hauswein rot (trocken), weiß, rosé', 'House Wine red (dry), white, rosé', null, null, null, [], [], $v([['0,2 l', '0.2 l', 5.90], ['0,75 l', '0.75 l', 23.50]])],
                    ['Weinschorle', 'Wine Spritzer', null, null, null, [], [], $v([['0,2 l', '0.2 l', 5.90]])],
                    ['Saure Kirsche, Pfeffi', 'Sour Cherry, Pfeffi', null, null, null, [], [], $v([['4 cl', '4 cl', 3.20]])],
                    ['Jägermeister, Ramazzotti, Sambuca, Baileys', 'Jägermeister, Ramazzotti, Sambuca, Baileys', null, null, null, [], [], $v([['4 cl', '4 cl', 4.00]])],
                ],
            ],
        ];
    }
}
