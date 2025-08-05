<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = ['name', 'address', 'contact'];

    public function orders()
    {
        return $this->hasMany(CustomersCashier::class, 'customer_id');
    }
}
