<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Customer;
use App\Models\Cashier;

class LoginController extends Controller
{
    public function customerLogin(Request $request)
    {
        $request->validate(['email'=>'required|email', 'password'=>'required']);
        $user = Customer::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('customer-token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function cashierLogin(Request $request)
    {
        $request->validate(['email'=>'required|email', 'password'=>'required']);
        $user = Cashier::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('cashier-token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }
}
