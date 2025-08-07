<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use App\Mail\OrderReceiptMail;
use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;

class CustomersCashierController extends Controller
{
    // List all orders (with customer & items)
    public function index()
    {
        return Order::with(['customer', 'cashier', 'items'])->get();
    }

    // Create new order (customer)
    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'checkout_date' => 'required|date',
            'cashier_id' => 'nullable|exists:cashiers,id'
        ]);

        $order = Order::create($validated);
        \Log::info('Broadcasting order.updated for order id: ' . $order->id);
        event(new \App\Events\OrderUpdated($order->load(['customer', 'cashier', 'items'])));
        return response()->json($order, 201);
    }

    // Show single order
    public function show($id)
    {
        return Order::with(['customer', 'cashier', 'items'])->findOrFail($id);
    }

    // Update order (cashier confirms)
    public function update(UpdateOrderRequest $request, $id)
    {
        $order = Order::with(['customer', 'items'])->findOrFail($id);

        $validated = $request->validated();
        $order->update($validated);
        \Log::info('Broadcasting order.updated for order id: ' . $order->id);
        event(new \App\Events\OrderUpdated($order->load(['customer', 'cashier', 'items'])));


        foreach ($order->items as $item) {
            $item->decrement('stock', $item->pivot->quantity);
            $item->refresh();
            event(new \App\Events\ItemUpdated($item));
        }


        if ($order->customer && $order->customer->email) {
            Mail::to($order->customer->email)->queue(new OrderReceiptMail($order));
        }
        

        return response()->json([
            'message' => 'Order confirmed, stock updated, and email queued.',
            'order' => $order
        ]);
    }



    // Delete order (optional)
    public function destroy($id)
    {
        Order::destroy($id);
        return response()->json(null, 204);
    }
}
