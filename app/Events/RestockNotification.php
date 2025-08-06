<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class RestockNotification implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $itemId;
    public $itemName;

    public function __construct($itemId, $itemName)
    {
        $this->itemId = $itemId;
        $this->itemName = $itemName;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('restocks');
    }

    public function broadcastWith()
    {
        return [
            'item_id' => $this->itemId,
            'item_name' => $this->itemName,
        ];
    }

    public function broadcastAs(): string
    {
        return 'item.restocked';
    }
}
