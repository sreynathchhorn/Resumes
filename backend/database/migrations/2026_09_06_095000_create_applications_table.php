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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // Explicitly link foreign key to the job_postings table
            $table->foreignId('job_id')->constrained('job_postings')->onDelete('cascade');
            $table->string('resume'); // Stores path to uploaded PDF resume
            $table->text('cover_letter')->nullable();
            $table->string('status')->default('pending'); // 'pending', 'accepted', 'rejected'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};