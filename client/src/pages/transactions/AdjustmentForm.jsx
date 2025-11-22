import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const AdjustmentForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
    const [formData, setFormData] = useState({
        reference: '',
        targetWarehouseId: '', // For adjustments, we use targetWarehouseId
        adjustmentType: 'ADD', // ADD or REMOVE
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
                type: 'ADJUST',
                ...formData,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: parseInt(item.quantity)
                }))
            });
            navigate('/operations/adjustments');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold">New Stock Adjustment</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="card p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Adjustment Type</label>
                            <select
                                className="input w-full"
                                value={formData.adjustmentType}
                                onChange={(e) => setFormData({ ...formData, adjustmentType: e.target.value })}
                                required
                            >
                                <option value="ADD">Add Stock (+)</option>
                                <option value="REMOVE">Remove Stock (-)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Warehouse</label>
                            <select
                                className="input w-full"
                                value={formData.targetWarehouseId}
                                onChange={(e) => setFormData({ ...formData, targetWarehouseId: e.target.value })}
                                required
                            >
                                <option value="">Select Warehouse</option>
                                {warehouses.map(w => (
                                    <option key={w.id} value={w.id}>{w.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Input
                        label="Reason / Notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Why is this adjustment being made?"
                        required
                    />
                </div>

                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-4">Items</h3>
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Product</label>
                                    <select
                                        className="input w-full"
                                        value={item.productId}
                                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-32">
                                    <Input
                                        label="Quantity"
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg mb-0.5"
                                    disabled={items.length === 1}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Item
                    </button>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={loading}>
                        Save as Draft
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdjustmentForm;
