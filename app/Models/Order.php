<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['customer_id', 'cashier_id', 'checkout_date'];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function cashier()
    {
        return $this->belongsTo(Cashier::class);
    }

    public function items()
    {
        return $this->belongsToMany(Item::class, 'orders_items')
            ->withPivot('quantity');
    }
}
