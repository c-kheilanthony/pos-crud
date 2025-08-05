<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = ['name', 'price', 'stock'];

    public function orderItems()
    {
        return $this->hasMany(OrdersItem::class, 'item_id');
    }
}
