<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdersItem extends Model
{
    protected $fillable = ['order_id', 'item_id', 'quantity'];

    public function order()
    {
        return $this->belongsTo(CustomersCashier::class, 'order_id');
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
