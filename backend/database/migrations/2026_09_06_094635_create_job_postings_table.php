<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('company_name');
            $table->string('location')->default('Phnom Penh, Cambodia');
            $table->string('employment_type')->default('Full-time');
            $table->string('work_mode')->default('On-site');
            $table->string('salary')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('job_postings'); }
};
