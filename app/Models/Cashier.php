<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Cashier extends Authenticatable
{
    use HasApiTokens;
    protected $fillable = ['name', 'counter', 'email', 'password'];

    public function orders()
    {
        return $this->hasMany(CustomersCashier::class, 'cashier_id');
    }
}
