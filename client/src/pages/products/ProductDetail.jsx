import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { ArrowLeft, Edit, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from '../../components/Button';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productData, stockData] = await Promise.all([
                    api.getProduct(id),
                    api.getProductStock(id)
                ]);
                setProduct(productData);
                setStock(stockData);
            } catch (error) {
                console.error('Failed to load product details', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    const totalStock = stock.reduce((acc, s) => acc + s.quantity, 0);
    const stockStatus = totalStock === 0 ? 'OUT_OF_STOCK' : totalStock <= product.minStock ? 'LOW_STOCK' : 'OK';

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/products')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="font-mono">{product.sku}</span>
                            <span>•</span>
                            <span>{product.category}</span>
                        </div>
                    </div>
                </div>
                <Button onClick={() => navigate(`/products/${id}/edit`)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Product
                </Button>
            </div>

            {/* Product Info Card */}
            <div className="card p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Price</label>
                        <div className="text-2xl font-semibold">${product.price?.toFixed(2)}</div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Total Stock</label>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-semibold">{totalStock} {product.uom}</span>
                            {stockStatus === 'LOW_STOCK' && (
                                <span className="badge badge-warning flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Low Stock
                                </span>
                            )}
                            {stockStatus === 'OUT_OF_STOCK' && (
                                <span className="badge badge-error flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Out of Stock
                                </span>
                            )}
                            {stockStatus === 'OK' && (
                                <span className="badge badge-success flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> In Stock
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <div>
                            <span className={`badge ${product.isActive ? 'badge-success' : 'badge-neutral'}`}>
                                {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>

                {product.description && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <label className="text-sm font-medium text-gray-500">Description</label>
                        <p className="mt-2 text-gray-700">{product.description}</p>
                    </div>
                )}
            </div>

            {/* Stock Availability Table */}
            <div className="card p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Stock Availability per Location
                    </h3>
                </div>
                <table className="table w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-4">Warehouse</th>
                            <th className="text-left p-4">Location</th>
                            <th className="text-right p-4">Quantity</th>
                            <th className="text-center p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stock.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100 last:border-0">
                                <td className="p-4 font-medium">{item.warehouse.name}</td>
                                <td className="p-4 text-gray-500">{item.location?.name || 'General Stock'}</td>
                                <td className="p-4 text-right font-mono">
                                    {item.quantity} {product.uom}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`badge ${item.quantity > 0 ? 'badge-success' : 'badge-neutral'}`}>
                                        {item.quantity > 0 ? 'Available' : 'Empty'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {stock.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500">
                                    No stock recorded for this product.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductDetail;
