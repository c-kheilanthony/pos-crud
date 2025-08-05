<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home route
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Protected dashboard route
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Customer SPA page (requires customer auth)
// Customer flow page
Route::get('/customer-flow', fn() => Inertia::render('customer-flow'))
    ->name('customer.flow');

// Cashier flow page
Route::get('/cashier-flow', fn() => Inertia::render('cashier-flow'))
    ->name('cashier.flow');


// Include existing auth and settings routes
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
