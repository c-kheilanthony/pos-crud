import type { OrderWithItems } from '../../types';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

interface Props {
    open: boolean;
    order: OrderWithItems | null;
    onConfirm: (id: number) => Promise<void>;
    onReject: (id: number) => Promise<void>;
    onClose: () => void;
    isLoading?: boolean;
}

export function OrderDetailModal({ open, order, onConfirm, onReject, onClose, isLoading }: Props) {
    if (!open || !order) return null;

    // compute totals
    const subtotal = order.items.reduce((sum, i) => sum + i.price * i.pivot.quantity, 0);
    const vat = subtotal * 0.12;
    const delivery = 50;
    const grandTotal = subtotal + vat + delivery;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md space-y-4">
                <DialogHeader>
                    <DialogTitle>Order #{order.id} Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                    {order.items.map((i) => (
                        <div key={i.id} className="flex justify-between">
                            <span>
                                {i.name} × {i.pivot.quantity}
                            </span>
                            <span>₱{(i.price * i.pivot.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-1 border-t pt-2 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₱{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>VAT (12%)</span>
                        <span>₱{vat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery</span>
                        <span>₱{delivery.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₱{grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                <DialogFooter className="flex justify-end space-x-2">
                    <Button onClick={() => onConfirm(order.id)} disabled={isLoading}>
                        {isLoading ? (
                            <span className="m-auto block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
                        ) : (
                            'Confirm'
                        )}
                    </Button>
                    <Button variant={'destructive'} onClick={() => onReject(order.id)} disabled={isLoading}>
                        {isLoading ? (
                            <span className="m-auto block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-red-500" />
                        ) : (
                            'Reject'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
