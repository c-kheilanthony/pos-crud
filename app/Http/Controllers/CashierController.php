<?php

namespace App\Http\Controllers;

use App\Models\Cashier;
use App\Http\Requests\StoreCashierRequest;
use App\Http\Requests\UpdateCashierRequest;

class CashierController extends Controller
{
    public function index()
    {
        return Cashier::all();
    }

    public function store(StoreCashierRequest $request)
    {
        $validated = $request->validated();
        $cashier = Cashier::create($validated);
        return response()->json($cashier, 201);
    }

    public function show($id)
    {
        return Cashier::findOrFail($id);
    }

    public function update(UpdateCashierRequest $request, $id)
    {
        $cashier = Cashier::findOrFail($id);
        $cashier->update($request->validated());
        return $cashier;
    }

    public function destroy($id)
    {
        Cashier::destroy($id);
        return response()->json(null, 204);
    }
}
