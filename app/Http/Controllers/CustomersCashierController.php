<?php

namespace App\Http\Controllers;

use App\Models\CustomersCashier;
use Illuminate\Http\Request;

class CustomersCashierController extends Controller
{
    public function index()
    {
        // Include customer and cashier details in response
        return CustomersCashier::with(['customer', 'cashier', 'items'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'checkout_date' => 'required|date',
            'cashier_id' => 'nullable|exists:cashiers,id'
        ]);
        $order = CustomersCashier::create($validated);
        return response()->json($order, 201);
    }

    public function show($id)
    {
        return CustomersCashier::with(['customer', 'cashier', 'items'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $order = CustomersCashier::findOrFail($id);
        $order->update($request->all());
        return $order;
    }

    public function destroy($id)
    {
        CustomersCashier::destroy($id);
        return response()->json(null, 204);
    }
}
