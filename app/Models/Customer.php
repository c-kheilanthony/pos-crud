<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Customer extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = ['name', 'address', 'contact', 'email', 'password'];

    public function orders()
    {
        return $this->hasMany(CustomersCashier::class, 'customer_id');
    }
}
