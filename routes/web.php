<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Optional landing page
Route::get('/', fn() => Inertia::render('welcome'))->name('home');

// Customer SPA page
Route::get('/customer-flow', fn() => Inertia::render('CustomerFlow'))
    ->name('customer.flow');

// Cashier SPA page
Route::get('/cashier-flow', fn() => Inertia::render('CashierFlow'))
    ->name('cashier.flow');
