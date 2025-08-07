<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class ItemUpdated implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    public $item;

    public function __construct($item)
    {
        $this->item = $item;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('items');
    }

    public function broadcastAs(): string
    {
        return 'item.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'item' => $this->item,
        ];
    }
}
