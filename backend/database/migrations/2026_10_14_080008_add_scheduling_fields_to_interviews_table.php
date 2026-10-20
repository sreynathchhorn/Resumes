
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('interviews', function (Blueprint $table) {
            $table->foreignId('application_id')
                ->unique()
                ->constrained('applications')
                ->cascadeOnDelete();

            $table->dateTime('interview_date');
            $table->string('interview_time')->nullable();
            $table->string('interview_format')->default('online');
            $table->text('notes')->nullable();
            $table->timestamp('invitation_sent_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('interviews', function (Blueprint $table) {
            $table->dropForeign(['application_id']);
            $table->dropUnique(['application_id']);

            $table->dropColumn([
                'application_id',
                'interview_date',
                'interview_time',
                'interview_format',
                'notes',
                'invitation_sent_at',
            ]);
        });
    }
};
