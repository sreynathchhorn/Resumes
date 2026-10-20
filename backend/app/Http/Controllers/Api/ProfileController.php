<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $profile = $request->user()->profile;

        if (! $profile) {
            return response()->json(null, 404);
        }

        return response()->json($profile);
    }
    // បន្ថែម Function resume ត្រង់នេះ
    public function resume(Request $request)
    {
        $profile = $request->user()->profile;

        if (! $profile) {
            return response()->json(['message' => 'Resume not found'], 404);
        }
        return response()->json($profile);
    }
    public function update(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:5000',
            'phone' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'skills' => 'nullable|string|max:5000',
            'experience' => 'nullable|string|max:10000',
            'education' => 'nullable|string|max:10000',
            'portfolio_url' => 'nullable|url|max:2048',
        ]);
        $profile = Profile::updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated,
        );
        return response()->json([
            'message' => 'Resume profile saved successfully.',
            'profile' => $profile,
        ]);
    }
}