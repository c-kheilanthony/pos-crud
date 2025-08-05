<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CashierController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\CustomersCashierController;
use App\Http\Controllers\OrdersItemController;

Route::apiResource('customers', CustomerController::class);
Route::apiResource('cashiers', CashierController::class);
Route::apiResource('items', ItemController::class);
Route::apiResource('orders', CustomersCashierController::class);
Route::apiResource('order-items', OrdersItemController::class);
