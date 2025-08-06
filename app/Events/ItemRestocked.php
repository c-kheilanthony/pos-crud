<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ItemRestocked implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $customerId,
        public int $itemId,
        public string $itemName,
    ) {}

    public function broadcastOn(): Channel
    {
        return new PrivateChannel('customer.'.$this->customerId);
    }

    public function broadcastAs(): string
    {
        return 'item.restocked';
    }

    public function broadcastWith(): array
    {
        return [
            'item_id'   => $this->itemId,
            'item_name' => $this->itemName,
        ];
    }
}

