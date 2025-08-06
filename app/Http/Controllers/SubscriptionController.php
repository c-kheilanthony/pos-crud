<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscription;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request, $itemId)
    {
        if (!$request->user() instanceof \App\Models\Customer) {
            abort(403, 'Only customers can subscribe.');
        }

        $customerId = $request->user()->id;

        $exists = Subscription::where('customer_id', $customerId)
            ->where('item_id', $itemId)
            ->exists();

        if (!$exists) {
            Subscription::create([
                'customer_id' => $customerId,
                'item_id' => $itemId,
            ]);
        }

        return response()->json(['subscribed' => true]);
    }

    public function unsubscribe(Request $request, $itemId)
    {
        if (!$request->user() instanceof \App\Models\Customer) {
            abort(403, 'Only customers can unsubscribe.');
        }

        $customerId = $request->user()->id;

        Subscription::where('customer_id', $customerId)
            ->where('item_id', $itemId)
            ->delete();

        return response()->json(['subscribed' => false]);
    }

    public function list(Request $request)
    {
        if (!$request->user() instanceof \App\Models\Customer) {
            abort(403, 'Only customers can view subscriptions.');
        }

        $customerId = $request->user()->id;

        $itemIds = Subscription::where('customer_id', $customerId)
            ->pluck('item_id');

        return response()->json(['subscriptions' => $itemIds]);
    }
}
