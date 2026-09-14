<?php

use App\Http\Controllers\Admin\AdminBlogController;
use App\Http\Controllers\Admin\AdminContactController;
use App\Http\Controllers\Admin\AdminContactSlotController;
use App\Http\Controllers\Admin\AdminJobController;
use App\Http\Controllers\Admin\ImageController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\StatsController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\PublicSettingsController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('posts')->group(function () {
    Route::get('/', [BlogController::class, 'index']);
    Route::get('/{slug}', [BlogController::class, 'show']);
});

Route::prefix('jobs')->group(function () {
    Route::get('/', [JobController::class, 'index']);
    Route::get('/{slug}', [JobController::class, 'show']);
});

Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:contact');
Route::get('/settings', [PublicSettingsController::class, 'index']);

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::prefix('admin')->group(function () {
        Route::apiResource('posts', AdminBlogController::class);
        Route::apiResource('jobs', AdminJobController::class);

        Route::get('contact-submissions', [AdminContactController::class, 'index']);
        Route::patch('contact-submissions/{id}/status', [AdminContactController::class, 'updateStatus']);

        Route::get('stats', [StatsController::class, 'index']);

        Route::get('images', [ImageController::class, 'index']);
        Route::post('images', [ImageController::class, 'upload']);
        Route::delete('images', [ImageController::class, 'destroy']);

        Route::apiResource('contact-slots', AdminContactSlotController::class);

        Route::get('settings', [SettingsController::class, 'index']);
        Route::post('settings', [SettingsController::class, 'update']);
    });
});
