<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Application;
use App\Models\Interview;
use App\Models\Job;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class AdminController extends Controller
{
    /**
     * Check whether the current user is an administrator.
     */
    private function admin(Request $request): void
    {
        abort_unless(
            $request->user()?->role === 'admin',
            403,
            'Admin access required.'
        );
    }

    /**
     * Admin dashboard statistics and weekly activity analytics.
     */
    public function dashboard(Request $request)
    {
        $this->admin($request);

        $today = now()->startOfDay();
        $startDate = $today->copy()->subDays(6);

        $dailyCounts = ActivityLog::query()
            ->selectRaw(
                'DATE(created_at) as activity_date, COUNT(*) as total'
            )
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<', $today->copy()->addDay())
            ->groupBy('activity_date')
            ->pluck('total', 'activity_date');

        $weeklyActivity = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = $today->copy()->subDays($i);
            $dateKey = $date->toDateString();

            $weeklyActivity[] = [
                'date' => $dateKey,
                'day' => $date->format('D'),
                'count' => (int) ($dailyCounts[$dateKey] ?? 0),
            ];
        }

        return response()->json([
            'stats' => [
                'users' => User::count(),

                'new_users_today' => User::whereDate(
                    'created_at',
                    today()
                )->count(),

                'jobs' => Job::count(),

                'applications' => Application::count(),

                'pending_applications' => Application::whereIn(
                    'status',
                    ['applied', 'under_review', 'shortlisted']
                )->count(),

                'interviews' => Application::where(
                    'status',
                    'interview'
                )->count(),
            ],

            'recent_activity' => ActivityLog::with('user')
                ->latest()
                ->limit(10)
                ->get(),

            'weekly_activity' => $weeklyActivity,
        ]);
    }

    /**
     * Retrieve registered users for admin management.
     */
    public function users(Request $request)
    {
        $this->admin($request);

        $users = User::select(
            'id',
            'name',
            'email',
            'role',
            'status',
            'created_at',
            'last_login_at',
            'last_logout_at'
        )
            ->latest()
            ->get();

        return response()->json($users);
    }

    /**
     * Retrieve jobs for admin management.
     */
    public function jobs(Request $request)
    {
        $this->admin($request);

        return response()->json(
            Job::withCount('applications')->latest()->get()
        );
    }

    /**
     * Retrieve applications and their interview details.
     */
    public function applications(Request $request)
    {
        $this->admin($request);

        return response()->json(
            Application::with(['user', 'job', 'interview'])
                ->latest()
                ->get()
        );
    }

    /**
     * Schedule or update an interview and email the applicant.
     *
     * Interview details are saved before attempting to send the email.
     * Calling this endpoint again allows the admin to retry the invitation.
     */
    public function scheduleInterview(Request $request, int $id)
    {
        $this->admin($request);

        $data = $request->validate([
            'interview_date' => 'required|date|after_or_equal:today',
            'interview_time' => 'required|date_format:H:i',
            'interview_format' => 'required|in:online,in_person',
            'notes' => 'nullable|string|max:5000',
        ]);

        $application = Application::with(['user', 'job'])
            ->findOrFail($id);

        // Save the interview before attempting to send the email.
        $interview = Interview::updateOrCreate(
            ['application_id' => $application->id],
            [
                'interview_date' => $data['interview_date']
                    . ' ' . $data['interview_time'],
                'interview_time' => $data['interview_time'],
                'interview_format' => $data['interview_format'],
                'notes' => $data['notes'] ?? null,
            ]
        );

        // Update the application status.
        $application->update([
            'status' => 'interview',
        ]);

        $applicantEmail = $application->user?->email;

        if (!$applicantEmail) {
            return response()->json([
                'message' => 'Interview saved, but the applicant has no email address.',
                'interview' => $interview,
                'email_sent' => false,
            ], 422);
        }

        $applicantName = $application->user->name;
        $jobTitle = $application->job?->title ?? 'the position';
        $date = $data['interview_date'];
        $time = $data['interview_time'];

        $format = $data['interview_format'] === 'online'
            ? 'Online'
            : 'In person';

        $notes = $data['notes']
            ?? 'No additional details provided.';

        try {
            Mail::raw(
                "Hello {$applicantName},\n\n"
                . "You are invited to an interview for {$jobTitle}.\n\n"
                . "Date: {$date}\n"
                . "Time: {$time}\n"
                . "Format: {$format}\n"
                . "Details: {$notes}\n\n"
                . "Please contact the recruitment team if you have questions.\n\n"
                . "MNC Resume Studio",
                function ($message) use (
                    $applicantEmail,
                    $jobTitle
                ) {
                    $message->to($applicantEmail)
                        ->subject(
                            "Interview Invitation - {$jobTitle}"
                        );
                }
            );

            $interview->update([
                'invitation_sent_at' => now(),
            ]);

            return response()->json([
                'message' => 'Interview scheduled and invitation email sent.',
                'interview' => $interview->fresh(),
                'email_sent' => true,
            ]);
        } catch (Throwable $e) {
            Log::error('Interview invitation email failed.', [
                'application_id' => $application->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Interview saved, but the email could not be sent. Check mail settings and retry.',
                'interview' => $interview->fresh(),
                'email_sent' => false,
            ], 502);
        }
    }

    /**
     * Retrieve recent activity records.
     */
    public function activity(Request $request)
    {
        $this->admin($request);

        return response()->json(
            ActivityLog::with('user')->latest()->limit(100)->get()
        );
    }

    /**
     * Delete a registered user.
     */
    public function deleteUser(Request $request, int $id)
    {
        $this->admin($request);

        abort_if(
            $request->user()->id === $id,
            422,
            'You cannot delete your own admin account.'
        );

        User::findOrFail($id)->delete();

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'user_deleted',
            'description' => 'Deleted user #' . $id,
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }

    /**
     * Activate or suspend a registered user.
     */
    public function updateUserStatus(Request $request, int $id)
    {
        $this->admin($request);

        $user = User::findOrFail($id);

        abort_if(
            $user->id === $request->user()->id,
            422,
            'You cannot change your own status.'
        );

        $data = $request->validate([
            'status' => 'required|in:active,suspended',
        ]);

        $user->update($data);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'user_status_changed',
            'description' => 'Changed user #' . $user->id
                . ' status to ' . $user->status,
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'User status updated.',
            'user' => $user,
        ]);
    }
}

