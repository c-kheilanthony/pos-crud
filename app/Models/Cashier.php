<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cashier extends Model
{
    protected $fillable = ['name', 'counter'];

    public function orders()
    {
        return $this->hasMany(CustomersCashier::class, 'cashier_id');
    }
}
