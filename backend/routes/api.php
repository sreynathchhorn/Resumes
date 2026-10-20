
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\JobController;     
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AdminController;

Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1');

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

Route::get('/jobs', [JobController::class, 'index'])
    ->middleware('throttle:60,1');

Route::get('/jobs/{id}', [JobController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/resume', [ProfileController::class, 'resume']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::post('/jobs', [JobController::class, 'store']);
    Route::put('/jobs/{id}', [JobController::class, 'update']);
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']);

    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::get('/my-applications', [ApplicationController::class, 'myApplications']);
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::patch('/applications/{id}', [ApplicationController::class, 'updateStatus']);
    Route::get('/applications/{id}/resume', [ApplicationController::class, 'downloadResume']);

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);

        Route::get('/users', [AdminController::class, 'users']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::patch('/users/{id}/status', [AdminController::class, 'updateUserStatus']);

        Route::get('/jobs', [AdminController::class, 'jobs']);

        Route::get('/applications', [AdminController::class, 'applications']);

        // Schedule an interview and send the invitation email
        Route::post(
            '/applications/{id}/interview',
            [AdminController::class, 'scheduleInterview']
        );

        Route::get('/activity', [AdminController::class, 'activity']);
    });
});
