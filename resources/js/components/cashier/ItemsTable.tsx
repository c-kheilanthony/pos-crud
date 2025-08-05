import { ChevronLeft, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export interface Item {
    id: number;
    name: string;
    price: number;
    stock: number;
}

interface Props {
    items: Item[];
    onEdit: (item: Item) => void;
    onDelete: (id: number) => void;
}

export function ItemsTable({ items, onEdit, onDelete }: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = items.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    if (items.length === 0) {
        return <p>No items found</p>;
    }

    return (
        <Card className="flex flex-col p-4">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border px-4 py-2 text-left">Name</th>
                        <th className="border px-4 py-2 text-right">Price</th>
                        <th className="border px-4 py-2 text-center">Stock</th>
                        <th className="border px-4 py-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => (
                        <tr key={item.id}>
                            {/* Name with truncation + tooltip */}
                            <td className="border px-4 py-2">
                                <div className="max-w-[120px] truncate" title={item.name}>
                                    {item.name}
                                </div>
                            </td>

                            {/* Price capped at 9,999 */}
                            <td className="border px-4 py-2 text-right">₱{item.price > 9999 ? '9,999' : item.price}</td>

                            {/* Stock capped at 99 */}
                            <td className="border px-4 py-2 text-center">{item.stock > 99 ? '+99' : item.stock}</td>

                            {/* Actions side by side */}
                            <td className="border px-4 py-2 text-center">
                                <div className="flex justify-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}>
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}

                    {/* Empty rows for consistent height */}
                    {Array.from({ length: itemsPerPage - currentItems.length }).map((_, idx) => (
                        <tr key={`empty-${idx}`} className="h-12">
                            <td className="border px-4 py-2">&nbsp;</td>
                            <td className="border px-4 py-2">&nbsp;</td>
                            <td className="border px-4 py-2">&nbsp;</td>
                            <td className="border px-4 py-2">&nbsp;</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button key={page} size="sm" variant={page === currentPage ? 'default' : 'ghost'} onClick={() => setCurrentPage(page)}>
                            {page}
                        </Button>
                    ))}

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </Card>
    );
}
