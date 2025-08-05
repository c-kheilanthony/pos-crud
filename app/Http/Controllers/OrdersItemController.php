<?php

namespace App\Http\Controllers;

use App\Models\OrdersItem;
use Illuminate\Http\Request;

class OrdersItemController extends Controller
{
    public function index()
    {
        return OrdersItem::with(['order.customer', 'item'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'item_id'  => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $orderItem = OrdersItem::create($validated);
        return response()->json($orderItem, 201);
    }

    public function show($id)
    {
        return OrdersItem::with(['order.customer', 'item'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $orderItem = OrdersItem::findOrFail($id);
        $orderItem->update($request->all());
        return $orderItem;
    }

    public function destroy($id)
    {
        OrdersItem::destroy($id);
        return response()->json(null, 204);
    }
}
