<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('restocks', function () {
    return true;
});

Broadcast::channel('customer.{id}', function ($user, $id) {
    return $user->id === (int) $id;   // authorise
});
