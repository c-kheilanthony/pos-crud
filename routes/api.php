<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CashierController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\CustomersCashierController;
use App\Http\Controllers\OrdersItemController;

// ----------------------------
// Public Routes
// ----------------------------
Route::post('customer/login', [LoginController::class, 'customerLogin']);
Route::post('cashier/login', [LoginController::class, 'cashierLogin']);

// ----------------------------
// Customer Protected Routes
// ----------------------------
Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
    Route::get('customer/me', function (Request $request) {
        return $request->user();
    });

    // Customers can view items and create orders
    // Public for both authenticated roles

    Route::post('orders', [CustomersCashierController::class, 'store']); // create order
    Route::post('order-items', [OrdersItemController::class, 'store']); // add item to order
});

Route::middleware(['auth:sanctum'])->get('items', [ItemController::class, 'index']);

// ----------------------------
// Cashier Protected Routes
// ----------------------------
Route::middleware(['auth:sanctum', 'role:cashier'])->group(function () {
    Route::get('cashier/me', function (Request $request) {
        return $request->user();
    });

    // Cashier can view orders
    Route::get('orders', [CustomersCashierController::class, 'index']);

    // Cashier can manage inventory
    Route::apiResource('items', ItemController::class)->except(['index']); // manage stock

    // Cashier can confirm orders and update them
    Route::put('orders/{id}', [CustomersCashierController::class, 'update']);

    // Manage order-items except create (customer creates)
    Route::apiResource('order-items', OrdersItemController::class)->except(['store']);
});
