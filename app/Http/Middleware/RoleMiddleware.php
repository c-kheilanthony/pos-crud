<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next, $role)
    {
        $user = $request->user();

        if (($role === 'customer' && $user instanceof \App\Models\Customer) ||
            ($role === 'cashier' && $user instanceof \App\Models\Cashier)) {
            return $next($request);
        }

        return response()->json(['error' => 'Unauthorized'], 403);
    }

}
