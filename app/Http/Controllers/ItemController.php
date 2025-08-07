<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Subscription;
use App\Events\ItemRestocked;

class ItemController extends Controller
{
    public function index()
    {
        return Item::all();
    }

    public function store(StoreItemRequest $request)
    {
        $validated = $request->validated();

        $item = Item::create($validated);
        return response()->json($item, 201);
    }

    public function show($id)
    {
        return Item::findOrFail($id);
    }

    public function update(UpdateItemRequest $request, $id)
    {
        $item = Item::findOrFail($id);

        $validated = $request->validated();

        $previousStock = $item->stock;
        $item->update($validated);          
        \Log::info('Broadcasting item.updated for item id: ' . $item->id);
        event(new \App\Events\ItemUpdated($item));

        // === Restock notification ===
        if ($previousStock == 0 && $item->stock > 0) {
            // find all customer IDs who subscribed to this item
            $subscriberIds = \App\Models\Subscription::where('item_id', $item->id)
                ->pluck('customer_id');

            foreach ($subscriberIds as $customerId) {
                event(new \App\Events\ItemRestocked(
                    $customerId,
                    $item->id,
                    $item->name
                ));
            }

            // optional: clean up subscriptions now that item is back
            \App\Models\Subscription::where('item_id', $item->id)->delete();
        }

        return $item;   // JSON
    }


    public function destroy($id)
    {
        Item::destroy($id);
        return response()->json(null, 204);
    }
}
