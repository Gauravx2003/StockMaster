import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../utils/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { ArrowLeft } from 'lucide-react';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        price: '',
        minStock: '',
        uom: 'UNIT',
        description: '',
        isActive: true
    });

    useEffect(() => {
        if (id) {
            const loadProduct = async () => {
                try {
                    const product = await api.getProduct(id);
                    setFormData({
                        name: product.name,
                        sku: product.sku,
                        category: product.category || '',
                        price: product.price || 0,
                        minStock: product.minStock || 0,
                        uom: product.uom || 'UNIT',
                        description: product.description || '',
                        isActive: product.isActive ?? true
                    });
                } catch (error) {
                    console.error('Failed to load product');
                }
            };
            loadProduct();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                minStock: parseInt(formData.minStock)
            };

            if (id) {
                await api.updateProduct(id, data);
            } else {
                await api.createProduct(data);
            }
            navigate('/products');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold">{id ? 'Edit Product' : 'New Product'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="card p-6 space-y-6">
                <div className="flex justify-between items-start">
                    <div className="w-full mr-4">
                        <Input
                            label="Product Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex items-center h-full pt-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                            />
                            <span className="text-sm font-medium text-gray-700">Active</span>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="SKU"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        required
                    />
                    <Input
                        label="Category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        list="categories"
                    />
                    <datalist id="categories">
                        <option value="Electronics" />
                        <option value="Furniture" />
                        <option value="Office Supplies" />
                    </datalist>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Input
                        label="Price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                    <Input
                        label="Min Stock Level"
                        type="number"
                        min="0"
                        value={formData.minStock}
                        onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
                        <select
                            className="input w-full"
                            value={formData.uom}
                            onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
                        >
                            <option value="UNIT">Unit (Each)</option>
                            <option value="KG">Kilogram (kg)</option>
                            <option value="L">Liter (L)</option>
                            <option value="BOX">Box</option>
                            <option value="PACK">Pack</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        className="input w-full h-32 py-2"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Product details..."
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={loading}>
                        {id ? 'Update Product' : 'Create Product'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
