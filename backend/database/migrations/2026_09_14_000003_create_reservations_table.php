<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone', 50);
            $table->unsignedTinyInteger('guests');
            $table->date('date');
            $table->string('time', 5);
            $table->text('notes')->nullable();
            $table->string('locale', 2)->default('de');
            $table->enum('status', ['new', 'confirmed', 'declined', 'archived'])->default('new');
            $table->timestamps();

            $table->index(['status', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
