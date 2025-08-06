<?php

namespace App\Http\Controllers;

use App\Models\OrdersItem;
use App\Http\Requests\StoreOrdersItemRequest;
use App\Http\Requests\UpdateOrdersItemRequest;

class OrdersItemController extends Controller
{
    public function index()
    {
        return OrdersItem::with(['order.customer', 'item'])->get();
    }

    public function store(StoreOrdersItemRequest $request)
    {
        $validated = $request->validated();

        $orderItem = OrdersItem::create($validated);
        return response()->json($orderItem, 201);
    }

    public function show($id)
    {
        return OrdersItem::with(['order.customer', 'item'])->findOrFail($id);
    }

    public function update(UpdateOrdersItemRequest $request, $id)
    {
        $orderItem = OrdersItem::findOrFail($id);
        $orderItem->update($request->validated());
        return $orderItem;
    }

    public function destroy($id)
    {
        OrdersItem::destroy($id);
        return response()->json(null, 204);
    }
}
