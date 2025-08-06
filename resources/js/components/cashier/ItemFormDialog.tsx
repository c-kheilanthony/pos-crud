import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; price: number; stock: number }) => void;
    initialData?: { name: string; price: number; stock: number };
}

export function ItemFormDialog({ open, onClose, onSubmit, initialData }: Props) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPrice(initialData.price);
            setStock(initialData.stock);
        } else {
            setName('');
            setPrice(0);
            setStock(0);
        }
    }, [initialData, open]);

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error('Name cannot be empty');
            return;
        }
        if (price <= 0) {
            toast.error('Price must be greater than zero');
            return;
        }
        if (stock < 0) {
            toast.error('Stock must not be less than zero');
            return;
        }
        onSubmit({ name: name.trim(), price, stock });
        toast.success(initialData ? 'Item updated' : 'Item added');
        onClose();
    };

    if (!open) return null;

    return (
        <div className="bg-opacity-40 fixed inset-0 flex items-center justify-center bg-black">
            <Card className="w-96 space-y-4 p-6">
                <h2 className="text-xl font-bold">{initialData ? 'Edit Item' : 'Add Item'}</h2>
                <div>
                    <Label>Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <Label>Price</Label>
                    <Input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />
                </div>
                <div>
                    <Label>Stock</Label>
                    <Input type="number" value={stock} onChange={(e) => setStock(parseInt(e.target.value))} />
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>{initialData ? 'Update' : 'Add'}</Button>
                </div>
            </Card>
        </div>
    );
}
