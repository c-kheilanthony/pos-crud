<x-mail::message>
# Thank you for your purchase!

**Order ID:** {{ $order->id }}  
**Date:** {{ $order->checkout_date }}

@php
    // initialize grand total
    $grandTotal = 0;
@endphp

<table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
    <thead>
        <tr style="background-color: #f5f5f5;">
            <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Item</th>
            <th style="text-align: center; padding: 8px; border: 1px solid #ddd;">Qty</th>
            <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Price</th>
            <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Total</th>
        </tr>
    </thead>
    <tbody>
        @foreach($order->items as $item)
            @php
                $lineTotal = $item->price * $item->pivot->quantity;
                $grandTotal += $lineTotal;
            @endphp
            <tr>
                <td style="text-align: left; padding: 8px; border: 1px solid #ddd;">{{ $item->name }}</td>
                <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">{{ $item->pivot->quantity }}</td>
                <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">₱{{ number_format($item->price, 2) }}</td>
                <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">₱{{ number_format($lineTotal, 2) }}</td>
            </tr>
        @endforeach
    </tbody>
    <tfoot>
        <tr style="background-color: #f9f9f9;">
            <td colspan="3" style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">Grand Total</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">₱{{ number_format($grandTotal, 2) }}</td>
        </tr>
    </tfoot>
</table>

Thanks for shopping with us!  
</x-mail::message>
