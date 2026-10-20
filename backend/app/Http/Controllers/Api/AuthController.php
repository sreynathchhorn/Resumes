<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
            'role' => 'candidate',
        ]);

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'registered',
            'description' => 'New candidate account registered',
            'ip_address' => $request->ip(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['message' => 'User registered successfully', 'user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $fields = $request->validate(['email' => 'required|string|email', 'password' => 'required|string']);
        $user = User::where('email', $fields['email'])->first();

        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }
        if ($user->status !== 'active') {
            return response()->json(['message' => 'Your account is currently '.$user->status.'. Please contact an administrator.'], 403);
        }

        $user->forceFill(['last_login_at' => now()])->save();
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'logged_in',
            'description' => 'User logged in',
            'ip_address' => $request->ip(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['message' => 'Logged in successfully', 'user' => $user->fresh(), 'token' => $token], 200);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'logged_out',
            'description' => 'User logged out',
            'ip_address' => $request->ip(),
        ]);

        $request->user()->forceFill(['last_logout_at' => now()])->save();

        if ($request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }
        return response()->json(['message' => 'Logged out successfully']);
    }
}
