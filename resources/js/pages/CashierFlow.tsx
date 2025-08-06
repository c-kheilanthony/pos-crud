import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CashierLoginForm } from '../components/cashier/CashierLoginForm';
import { ItemFormDialog } from '../components/cashier/ItemFormDialog';
import { Item, ItemsTable } from '../components/cashier/ItemsTable';
import { OrderDetailModal } from '../components/cashier/OrderDetailModal';
import { OrdersList } from '../components/cashier/OrdersList';
import { Button } from '../components/ui/button';
import api from '../lib/cashierApi';
import type { OrderWithItems } from '../types';

export default function CashierFlow() {
    const [token, setToken] = useState(localStorage.getItem('cashierToken'));
    const [items, setItems] = useState<Item[]>([]);
    const [showItemForm, setShowItemForm] = useState(false);
    const [editItem, setEditItem] = useState<Item | null>(null);
    const [orders, setOrders] = useState<OrderWithItems[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    const fetchOrders = async () => {
        const { data } = await api.get<OrderWithItems[]>('/orders');
        setOrders(data.filter((o) => o.cashier_id === null));
    };

    const fetchItems = async () => {
        const { data } = await api.get<Item[]>('/items');
        setItems(data);
    };

    const addItem = async (data: { name: string; price: number; stock: number }) => {
        try {
            await api.post('/items', data);
            await fetchItems();
            toast.success('Item added');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add item');
        }
    };

    const updateItem = async (id: number, data: { name: string; price: number; stock: number }) => {
        try {
            await api.put(`/items/${id}`, data);
            await fetchItems();
            toast.success('Item updated');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update item');
        }
    };

    const deleteItem = async (id: number) => {
        try {
            await api.delete(`/items/${id}`);
            await fetchItems();
            toast.success('Item deleted');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete item');
        }
    };

    const confirmOrder = async (order: OrderWithItems) => {
        // Validate stock
        const outOfStockItems = order.items.filter((i) => i.stock < i.pivot.quantity);
        if (outOfStockItems.length > 0) {
            toast.error(`Cannot confirm. Out of stock: ${outOfStockItems.map((i) => i.name).join(', ')}`);
            return false;
        }

        await api.put(`/orders/${order.id}`, { cashier_id: 1 });
        toast.success('Order confirmed and stock updated');
        return true;
    };

    const logout = () => {
        localStorage.removeItem('cashierToken');
        setToken(null);
    };

    const validateToken = async () => {
        try {
            await api.get('/cashier/me');
        } catch {
            logout();
        }
    };

    useEffect(() => {
        if (token) {
            validateToken();
            fetchOrders();
            fetchItems();
        }
    }, [token]);

    if (!token) {
        return <CashierLoginForm onSuccess={setToken} />;
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Cashier Dashboard</h2>
                <Button variant="outline" onClick={logout}>
                    Logout
                </Button>
            </div>

            <div className="flex gap-6">
                {/* Left: Items Management */}
                <div className="w-[48%] space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Manage Items</h3>
                        <Button
                            onClick={() => {
                                setEditItem(null);
                                setShowItemForm(true);
                            }}
                        >
                            Add Item
                        </Button>
                    </div>
                    <ItemsTable
                        items={items}
                        onEdit={(item) => {
                            setEditItem(item);
                            setShowItemForm(true);
                        }}
                        onDelete={deleteItem}
                    />
                </div>

                {/* Right: Orders */}
                <div className="w-[58%] space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Pending Orders</h3>
                    </div>
                    <OrdersList
                        orders={orders}
                        onView={(order) => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                        }}
                        onConfirm={async (id) => {
                            const order = orders.find((o) => o.id === id);
                            if (!order) return;

                            const success = await confirmOrder(order);
                            if (success) {
                                await fetchOrders();
                                await fetchItems();
                            }
                        }}
                        onReject={async (id) => {
                            await api.delete(`/orders/${id}`);
                            await fetchOrders();
                            toast.error('Order rejected');
                        }}
                    />
                </div>
            </div>

            {/* Item Form Modal */}
            <ItemFormDialog
                open={showItemForm}
                onClose={() => setShowItemForm(false)}
                onSubmit={(data) => (editItem ? updateItem(editItem.id, data) : addItem(data))}
                initialData={editItem || undefined}
            />

            {/* Order Detail Modal */}
            <OrderDetailModal
                open={showOrderModal}
                order={selectedOrder}
                onClose={() => setShowOrderModal(false)}
                onReject={async (id) => {
                    await api.delete(`/orders/${id}`);
                    toast.error('Order rejected');
                    setShowOrderModal(false);
                    fetchOrders();
                }}
                onConfirm={async (id) => {
                    if (!selectedOrder) return;

                    const success = await confirmOrder(selectedOrder);
                    if (success) {
                        setShowOrderModal(false);
                        await fetchOrders();
                        await fetchItems();
                    }
                }}
            />
        </div>
    );
}
