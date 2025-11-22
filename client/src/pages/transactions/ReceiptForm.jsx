import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { ArrowLeft, Plus, Trash2, Package } from 'lucide-react';

const ReceiptForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
    const [formData, setFormData] = useState({
        reference: '',
        targetWarehouseId: '',
        supplier: '',
        scheduleDate: '',
        operationType: 'PURCHASE',
        notes: ''
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [p, w] = await Promise.all([api.getProducts(), api.getWarehouses()]);
                setProducts(p);
                setWarehouses(w);
            } catch (error) {
                console.error('Failed to load data', error);
            }
        };
        loadData();
    }, []);

    const handleAddItem = () => {
        setItems([...items, { productId: '', quantity: 1 }]);
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.createTransaction({
                type: 'IN',
                ...formData,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: parseInt(item.quantity)
                }))
            });
            navigate('/operations/receipts');
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DRAFT': return 'bg-gray-500';
            case 'WAITING': return 'bg-yellow-500';
            case 'READY': return 'bg-blue-500';
            case 'DONE': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">New Receipt</h1>
                        <p className="text-sm text-gray-500">Create inbound stock receipt</p>
                    </div>
                </div>

                {/* Status Flow */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor('DRAFT')}`}></div>
                        <span className="text-sm font-medium text-gray-700">Draft</span>
                        <span className="text-gray-400">→</span>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <span className="text-sm text-gray-400">Waiting</span>
                        <span className="text-gray-400">→</span>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <span className="text-sm text-gray-400">Ready</span>
                        <span className="text-gray-400">→</span>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <span className="text-sm text-gray-400">Done</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Main Form Card */}
                <div className="card p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Column 1 */}
                        <div className="space-y-4">
                            <Input
                                label="Receipt ID"
                                value={formData.reference}
                                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                placeholder="Auto-generated"
                            />
                            <Input
                                label="Supplier"
                                value={formData.supplier}
                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                placeholder="Enter supplier name"
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Warehouse *</label>
                                <select
                                    className="input w-full"
                                    value={formData.targetWarehouseId}
                                    onChange={(e) => setFormData({ ...formData, targetWarehouseId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Warehouse</option>
                                    {warehouses.map(w => (
                                        <option key={w.id} value={w.id}>{w.name} ({w.shortcode})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-4">
                            <Input
                                label="Schedule Date"
                                type="date"
                                value={formData.scheduleDate}
                                onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Operation Type</label>
                                <select
                                    className="input w-full"
                                    value={formData.operationType}
                                    onChange={(e) => setFormData({ ...formData, operationType: e.target.value })}
                                >
                                    <option value="PURCHASE">Purchase Order</option>
                                    <option value="RETURN">Customer Return</option>
                                    <option value="TRANSFER">Transfer In</option>
                                    <option value="PRODUCTION">Production Output</option>
                                </select>
                            </div>
                        </div>

                        {/* Column 3 - Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
                            <textarea
                                className="input w-full h-[calc(100%-2rem)] resize-none"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Additional notes..."
                                rows={6}
                            />
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Products</h3>
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Product
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 w-32">Qty</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">SKU</th>
                                    <th className="w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => {
                                    const product = products.find(p => p.id === item.productId);

                                    return (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <select
                                                    className="input w-full"
                                                    value={item.productId}
                                                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Product</option>
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="input w-full"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                    required
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                {product && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Package className="w-4 h-4" />
                                                        <span>{product.sku}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                    disabled={items.length === 1}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <div className="flex gap-3">
                        <Button type="submit" isLoading={loading}>
                            Save as Draft
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ReceiptForm;
