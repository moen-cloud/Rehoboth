import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Package, ShoppingBag, X } from 'lucide-react';
import generalBackground from '../assets/images/backgrounds/general-bg.jpg';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Cereals',
    stock: '',
  });

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const updateOrderStatus = async (orderId, status, adminResponse) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status, adminResponse });
      toast.success('Order updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    }
  };

  const toggleStockStatus = async (productId, currentStock) => {
    try {
      const product = products.find(p => p._id === productId);
      if (!product) return;

      const newStock = currentStock > 0 ? 0 : 10;
      
      const updatedData = {
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: newStock
      };

      await api.put(`/products/${productId}`, updatedData);
      toast.success(`Product marked as ${newStock > 0 ? 'In Stock' : 'Out of Stock'}`);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update stock status');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...productForm,
        image: editingProduct 
          ? products.find(p => p._id === editingProduct)?.image 
          : 'https://images.unsplash.com/photo-1599909221692-99f36d0d7c75?w=500'
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct}`, productData);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', productData);
        toast.success('Product created successfully');
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: 'Cereals',
        stock: '',
      });
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product._id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
    setShowProductForm(true);
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(210,180,140,0.85), rgba(181,136,99,0.85)), url(${generalBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">Admin Dashboard</h1>
          <p className="text-white/90 text-lg drop-shadow">Manage your store's orders and products</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 whitespace-nowrap transform hover:scale-105 shadow-lg ${
              activeTab === 'orders'
                ? 'bg-white text-amber-700'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-2 border-white/30'
            }`}
          >
            <Package className="w-6 h-6" />
            Manage Orders
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-3 px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 whitespace-nowrap transform hover:scale-105 shadow-lg ${
              activeTab === 'products'
                ? 'bg-white text-amber-700'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-2 border-white/30'
            }`}
          >
            <ShoppingBag className="w-6 h-6" />
            Manage Products
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-16 text-center shadow-2xl border-2 border-white/40">
                <Package className="w-16 h-16 text-white mx-auto mb-6 drop-shadow-lg" />
                <p className="text-white text-xl font-bold drop-shadow-lg">No orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all border-2 border-white/40 transform hover:scale-[1.01]">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-6">
                    <div className="flex-1">
                      <p className="font-bold text-xl text-white mb-3 drop-shadow-lg">Order #{order._id.slice(-8)}</p>
                      <div className="text-base text-white space-y-2 bg-white/20 backdrop-blur-sm p-4 rounded-2xl border-2 border-white/30 drop-shadow">
                        <p><span className="font-bold">Customer:</span> {order.shippingAddress?.name || order.user?.name}</p>
                        <p><span className="font-bold">Phone:</span> {order.shippingAddress?.phone || order.user?.phone}</p>
                        <p><span className="font-bold">Address:</span> {order.shippingAddress?.address}</p>
                        <p><span className="font-bold">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-left lg:text-right">
                      <p className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
                        KSh {order.totalPrice.toFixed(2)}
                      </p>
                      <div className="flex gap-3">
                        {order.isPaid ? (
                          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-green-400 to-green-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                            ✓ Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-red-400 to-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                            Not Paid
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t-2 border-white/30 pt-6 mb-6">
                    <h4 className="font-bold text-lg mb-4 text-white drop-shadow-lg">Order Items:</h4>
                    <div className="space-y-3">
                      {order.orderItems.map((item) => (
                        <div key={item._id} className="flex justify-between text-base bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30">
                          <span className="text-white font-medium drop-shadow">{item.name} × {item.quantity}</span>
                          <span className="font-bold text-white drop-shadow">KSh {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t-2 border-white/30 pt-6 space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-white mb-3 drop-shadow">
                        Update Status:
                      </label>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value, order.adminResponse || '')}
                        className="w-full lg:w-auto px-6 py-3 border-2 border-white/40 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-white/30 focus:border-white transition-all shadow-lg text-lg font-medium"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-3 drop-shadow">
                        Admin Response:
                      </label>
                      <textarea
                        defaultValue={order.adminResponse}
                        onBlur={(e) => updateOrderStatus(order._id, order.status, e.target.value)}
                        className="w-full px-6 py-4 border-2 border-white/40 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-white/30 focus:border-white transition-all shadow-lg text-base placeholder-gray-500"
                        rows="3"
                        placeholder="Add a response for the customer..."
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <button
              onClick={() => setShowProductForm(true)}
              className="mb-8 flex items-center gap-3 bg-white/20 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/30 backdrop-blur-sm"
            >
              <Plus className="w-6 h-6" />
              Add New Product
            </button>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-white/40">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-3xl font-bold text-white drop-shadow-lg">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                        setProductForm({
                          name: '',
                          description: '',
                          price: '',
                          category: 'Cereals',
                          stock: '',
                        });
                      }}
                      className="text-white/80 hover:text-white p-2 hover:bg-white/20 rounded-full transition"
                    >
                      <X className="w-8 h-8" />
                    </button>
                  </div>

                  <form onSubmit={handleProductSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-white mb-3 drop-shadow">Product Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Army Beans 1kg"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                          className="w-full px-4 py-3 border-2 border-white/40 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-white/30 focus:border-white transition-all shadow-lg placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-white mb-3 drop-shadow">Price (KSh)</label>
                        <input
                          type="number"
                          placeholder="200"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          required
                          className="w-full px-4 py-3 border-2 border-white/40 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-white/30 focus:border-white transition-all shadow-lg placeholder-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-3 drop-shadow">Description</label>
                      <textarea
                        placeholder="Premium-quality, naturally sourced..."
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        required
                        className="w-full px-4 py-4 border-2 border-white/40 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-white/30 focus:border-white transition-all shadow-lg placeholder-gray-500"
                        rows="3"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-white mb-3 drop-shadow">Category</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-white/40 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-white/30 focus:border-white transition-all shadow-lg"
                        >
                          <option value="Cereals">Cereals</option>
                          <option value="Spices">Spices</option>
                          <option value="Grains">Grains</option>
                          <option value="Beverages">Beverages</option>
                          <option value="Snacks">Snacks</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-white mb-3 drop-shadow">Stock Quantity</label>
                        <input
                          type="number"
                          placeholder="50"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          required
                          className="w-full px-4 py-3 border-2 border-white/40 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-white/30 focus:border-white transition-all shadow-lg placeholder-gray-500"
                        />
                      </div>
                    </div>

                    <p className="text-sm text-white bg-white/20 backdrop-blur-sm p-4 rounded-full border-2 border-white/30 font-medium drop-shadow">
                      💡 Set stock to 0 to mark as Out of Stock
                    </p>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-white/20 text-white px-6 py-4 rounded-full font-medium text-lg hover:bg-white/30 transition-all duration-300 disabled:opacity-50 shadow-lg border-2 border-white/30 backdrop-blur-sm"
                      >
                        {loading ? 'Saving...' : 'Save Product'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                          setProductForm({
                            name: '',
                            description: '',
                            price: '',
                            category: 'Cereals',
                            stock: '',
                          });
                        }}
                        className="px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-full font-medium hover:bg-white/20 transition-all duration-300 text-lg backdrop-blur-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => {
                const isInStock = product.stock > 0;
                return (
                  <div key={product._id} className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 group border-2 border-white/40 transform hover:scale-105">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x400?text=Product';
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        {isInStock ? (
                          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-green-400 to-green-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-red-400 to-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 text-white line-clamp-2 drop-shadow-lg">{product.name}</h3>
                      <p className="text-white/90 text-sm mb-4 line-clamp-2 drop-shadow">{product.description}</p>
                      
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-white drop-shadow-lg">
                          KSh {product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-white font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30 drop-shadow">
                          Stock: {product.stock}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => toggleStockStatus(product._id, product.stock)}
                        className={`w-full mb-3 py-2.5 rounded-full font-medium transition-all duration-300 shadow-lg ${
                          isInStock
                            ? 'bg-red-500/80 text-white hover:bg-red-600/80'
                            : 'bg-green-500/80 text-white hover:bg-green-600/80'
                        }`}
                      >
                        {isInStock ? 'Mark as Out of Stock' : 'Mark as In Stock'}
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => editProduct(product)}
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-500/80 text-white py-2.5 rounded-full font-medium hover:bg-blue-600/80 transition-all duration-300 shadow-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-500/80 text-white py-2.5 rounded-full font-medium hover:bg-red-600/80 transition-all duration-300 shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;