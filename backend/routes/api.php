<?php

use App\Http\Controllers\Admin\AdminGalleryController;
use App\Http\Controllers\Admin\AdminMenuCategoryController;
use App\Http\Controllers\Admin\AdminMenuItemController;
use App\Http\Controllers\Admin\AdminReservationController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\StatsController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\PublicSettingsController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

// Public
Route::get('/settings', [PublicSettingsController::class, 'index']);
Route::get('/menu', [MenuController::class, 'index']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::post('/reservations', [ReservationController::class, 'store'])->middleware('throttle:reservation');

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

// Admin
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::prefix('admin')->group(function () {
        Route::get('stats', [StatsController::class, 'index']);

        Route::post('menu-categories/reorder', [AdminMenuCategoryController::class, 'reorder']);
        Route::apiResource('menu-categories', AdminMenuCategoryController::class)->except('show');

        Route::post('menu-items/reorder', [AdminMenuItemController::class, 'reorder']);
        Route::apiResource('menu-items', AdminMenuItemController::class)->except('show');

        Route::post('gallery/reorder', [AdminGalleryController::class, 'reorder']);
        Route::apiResource('gallery', AdminGalleryController::class)->except('show');

        Route::get('reservations', [AdminReservationController::class, 'index']);
        Route::get('reservations/{reservation}', [AdminReservationController::class, 'show']);
        Route::patch('reservations/{reservation}/status', [AdminReservationController::class, 'updateStatus']);
        Route::delete('reservations/{reservation}', [AdminReservationController::class, 'destroy']);

        Route::get('settings', [SettingsController::class, 'index']);
        Route::post('settings', [SettingsController::class, 'update']);
    });
});
