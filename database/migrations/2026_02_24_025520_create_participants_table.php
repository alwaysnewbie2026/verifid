<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('participants', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('participant_id')->unique();
        $table->string('program');
        $table->string('grade');
        $table->string('status')->default('Lulus');
        $table->date('date');
        $table->string('certificate')->nullable(); // Untuk path file PDF
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};
