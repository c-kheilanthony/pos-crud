<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index()
    {
        return Item::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $item = Item::create($validated);
        return response()->json($item, 201);
    }

    public function show($id)
    {
        return Item::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $item = Item::findOrFail($id);
        $item->update($request->all());
        return $item;
    }

    public function destroy($id)
    {
        Item::destroy($id);
        return response()->json(null, 204);
    }
}
