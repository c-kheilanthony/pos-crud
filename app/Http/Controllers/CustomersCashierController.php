<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class CustomersCashierController extends Controller
{
    // List all orders (with customer & items)
    public function index()
    {
        return Order::with(['customer', 'cashier', 'items'])->get();
    }

    // Create new order (customer)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'checkout_date' => 'required|date',
            'cashier_id' => 'nullable|exists:cashiers,id'
        ]);

        $order = Order::create($validated);
        return response()->json($order, 201);
    }

    // Show single order
    public function show($id)
    {
        return Order::with(['customer', 'cashier', 'items'])->findOrFail($id);
    }

    // Update order (cashier confirms)
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'cashier_id' => 'required|exists:cashiers,id'
        ]);

        $order->update($validated);
        return response()->json($order);
    }

    // Delete order (optional)
    public function destroy($id)
    {
        Order::destroy($id);
        return response()->json(null, 204);
    }
}
