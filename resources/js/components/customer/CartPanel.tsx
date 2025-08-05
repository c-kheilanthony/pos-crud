import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Item } from './ItemsGrid';

interface CartPanelProps {
    items: Item[];
    cart: Record<number, number>;
    onCheckout: () => Promise<void>;
    showDetails?: boolean;
}

export function CartPanel({ items, cart, onCheckout, showDetails = false }: CartPanelProps) {
    const cartEntries = Object.entries(cart).filter(([, qty]) => qty > 0);

    const subtotal = cartEntries.reduce((sum, [id, qty]) => {
        const price = items.find((i) => i.id === Number(id))?.price || 0;
        return sum + price * qty;
    }, 0);
    const vat = subtotal * 0.12;
    const delivery = 50;
    const total = subtotal + vat + delivery;

    return (
        <Card className="p-4">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Your Cart</h3>
            </div>

            <div className="scrollbar-modern max-h-40 overflow-y-auto pr-2">
                {cartEntries.map(([id, qty]) => {
                    const item = items.find((i) => i.id === Number(id));
                    return (
                        <div key={id} className="flex justify-between rounded-md px-1 py-2 transition-colors hover:bg-muted/10">
                            <span className="max-w-[180px] truncate">{item?.name}</span>
                            <span className="font-medium whitespace-nowrap">
                                {qty} × ₱{item?.price.toFixed(2)}
                            </span>
                        </div>
                    );
                })}
            </div>

            {showDetails && (
                <>
                    <hr className="my-2" />
                    <div className="space-y-1 text-sm">
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
                            <span>₱{total.toFixed(2)}</span>
                        </div>
                    </div>
                </>
            )}

            <Button className="mt-4 w-full" onClick={onCheckout} disabled={!cartEntries.length}>
                Checkout
            </Button>
        </Card>
    );
}
