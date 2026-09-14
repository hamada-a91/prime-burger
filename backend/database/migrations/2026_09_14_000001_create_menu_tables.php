<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_categories', function (Blueprint $table) {
            $table->id();
            $table->json('name');                       // {"de": "...", "en": "..."}
            $table->json('description')->nullable();    // {"de": "...", "en": "..."}
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('menu_categories')->cascadeOnDelete();
            $table->json('name');
            $table->json('description')->nullable();
            $table->decimal('price', 8, 2)->nullable();  // null when variants carry the prices
            $table->json('variants')->nullable();        // [{"label": {"de": "0,2 l", "en": "0.2 l"}, "price": 3.2}]
            $table->json('price_note')->nullable();      // {"de": "Aufpreis ...", "en": "Extra charge ..."}
            $table->json('allergens')->nullable();       // ["A", "C", "G"]
            $table->json('tags')->nullable();            // ["vegan", "spicy", "signature"]
            $table->boolean('is_available')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['category_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
        Schema::dropIfExists('menu_categories');
    }
};
