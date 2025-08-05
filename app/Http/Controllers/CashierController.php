<?php

namespace App\Http\Controllers;

use App\Models\Cashier;
use Illuminate\Http\Request;

class CashierController extends Controller
{
    public function index()
    {
        return Cashier::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'counter' => 'required|string',
        ]);

        $cashier = Cashier::create($validated);
        return response()->json($cashier, 201);
    }

    public function show($id)
    {
        return Cashier::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $cashier = Cashier::findOrFail($id);
        $cashier->update($request->all());
        return $cashier;
    }

    public function destroy($id)
    {
        Cashier::destroy($id);
        return response()->json(null, 204);
    }
}
