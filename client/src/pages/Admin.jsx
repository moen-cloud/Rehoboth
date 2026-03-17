import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  ChevronDown,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  Ban,
  Eye,
  Save,
  RotateCcw,
} from 'lucide-react';
import generalBackground from '../assets/images/backgrounds/general-bg.jpg';

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ['Spices', 'Cereals', 'Grains', 'Beverages', 'Snacks', 'Other'];
const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_STYLES = {
  Pending:    'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white',
  Processing: 'bg-gradient-to-r from-blue-400 to-blue-500 text-white',
  Shipped:    'bg-gradient-to-r from-purple-400 to-purple-500 text-white',
  Delivered:  'bg-gradient-to-r from-green-400 to-green-500 text-white',
  Cancelled:  'bg-gradient-to-r from-red-400 to-red-500 text-white',
};

const EMPTY_PRODUCT = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: 'Cereals',
  stock: '',
  sortOrder: 0,
};

// ─── Shared background style ──────────────────────────────────────────────────
const bgStyle = {
  backgroundImage: `linear-gradient(rgba(210,180,140,0.85), rgba(181,136,99,0.85)), url(${generalBackground})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, sub }) => (
  <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/40 shadow-xl flex items-center gap-5">
    <div className="bg-white/30 p-4 rounded-2xl border-2 border-white/40 flex-shrink-0">
      <Icon className="w-7 h-7 text-white drop-shadow" />
    </div>
    <div>
      <p className="text-white/80 text-sm font-medium drop-shadow">{label}</p>
      <p className="text-3xl font-bold text-white drop-shadow-lg">{value}</p>
      {sub && <p className="text-white/70 text-xs mt-0.5 drop-shadow">{sub}</p>}
    </div>
  </div>
);

// ─── Section Wrapper ──────────────────────────────────────────────────────────
const Section = ({ children }) => (
  <div className="bg-white/30 backdrop-blur-lg rounded-3xl border-2 border-white/40 shadow-xl overflow-hidden">
    {children}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Admin = () => {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState('dashboard');

  // Dashboard
  const [stats, setStats] = useState(null);

  // Products
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [imageUploading, setImageUploading] = useState(false);
  const [productSaving, setProductSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  // Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderStatusForm, setOrderStatusForm] = useState({});
  const [orderSaving, setOrderSaving] = useState(null);

  // Users
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // ── Data fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (tab === 'dashboard') fetchStats();
    if (tab === 'products') fetchProducts();
    if (tab === 'orders') fetchOrders();
    if (tab === 'users') fetchUsers();
  }, [tab]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch {
      toast.error('Failed to load stats');
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const { data } = await api.get('/admin/products');
      setProducts(data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  // ── Product Modal ──────────────────────────────────────────────────────────
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm(EMPTY_PRODUCT);
    setShowProductModal(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
      sortOrder: product.sortOrder ?? 0,
    });
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm(EMPTY_PRODUCT);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProductForm((prev) => ({ ...prev, image: data.imageUrl }));
      toast.success('Image uploaded!');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  const handleProductSave = async () => {
    if (!productForm.name || !productForm.price || !productForm.image || !productForm.category) {
      toast.error('Please fill in all required fields and upload an image');
      return;
    }
    setProductSaving(true);
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        sortOrder: Number(productForm.sortOrder),
      };
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/admin/products', payload);
        toast.success('Product created!');
      }
      closeProductModal();
      fetchProducts();
    } catch {
      toast.error('Failed to save product');
    } finally {
      setProductSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Product deleted');
      setDeleteConfirm(null);
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  // ── Orders ─────────────────────────────────────────────────────────────────
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'paid') return o.isPaid;
    if (orderFilter === 'unpaid') return !o.isPaid && o.status !== 'Cancelled';
    if (orderFilter === 'cancelled') return o.status === 'Cancelled';
    return true;
  });

  const handleOrderStatusSave = async (orderId) => {
    const form = orderStatusForm[orderId] || {};
    if (!form.status) return;
    setOrderSaving(orderId);
    try {
      await api.put(`/admin/orders/${orderId}/status`, {
        status: form.status,
        adminResponse: form.adminResponse || '',
      });
      toast.success('Order updated!');
      setOrderStatusForm((prev) => ({ ...prev, [orderId]: {} }));
      setExpandedOrder(null);
      fetchOrders();
    } catch {
      toast.error('Failed to update order');
    } finally {
      setOrderSaving(null);
    }
  };

  const initOrderForm = (order) => {
    if (!orderStatusForm[order._id]) {
      setOrderStatusForm((prev) => ({
        ...prev,
        [order._id]: { status: order.status, adminResponse: order.adminResponse || '' },
      }));
    }
    setExpandedOrder(expandedOrder === order._id ? null : order._id);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={bgStyle}>
      <div className="container mx-auto px-4 py-8 lg:py-12">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
            Admin Dashboard
          </h1>
          <p className="text-white/80 text-lg mt-1 drop-shadow">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { key: 'products',  label: 'Products',  icon: Package },
            { key: 'orders',    label: 'Orders',    icon: ShoppingBag },
            { key: 'users',     label: 'Users',     icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-base transition-all transform hover:scale-105 ${
                tab === key
                  ? 'bg-white text-amber-700 shadow-xl'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-2 border-white/30'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD TAB ───────────────────────────────────────────────── */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            {!stats ? (
              <p className="text-white text-xl drop-shadow-lg">Loading stats...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                  <StatCard label="Total Products" value={stats.totalProducts} icon={Package} />
                  <StatCard label="Total Orders" value={stats.totalOrders} icon={ShoppingBag} sub={`${stats.pendingOrders} pending`} />
                  <StatCard label="Total Users" value={stats.totalUsers} icon={Users} />
                  <StatCard label="Total Revenue" value={`KSh ${stats.totalRevenue.toLocaleString()}`} icon={TrendingUp} sub="From paid orders" />
                </div>

                <Section>
                  <div className="p-6 border-b-2 border-white/30">
                    <h2 className="text-xl font-bold text-white drop-shadow-lg">Quick Actions</h2>
                  </div>
                  <div className="p-6 flex flex-wrap gap-4">
                    <button
                      onClick={() => { setTab('products'); setTimeout(openAddProduct, 100); }}
                      className="flex items-center gap-2 bg-white text-amber-700 px-6 py-3 rounded-2xl font-bold shadow-xl hover:bg-amber-50 transition-all transform hover:scale-105"
                    >
                      <Plus className="w-5 h-5" /> Add New Product
                    </button>
                    <button
                      onClick={() => setTab('orders')}
                      className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-2xl font-semibold border-2 border-white/30 hover:bg-white/30 transition-all transform hover:scale-105"
                    >
                      <ShoppingBag className="w-5 h-5" /> Manage Orders
                    </button>
                  </div>
                </Section>
              </>
            )}
          </div>
        )}

        {/* ── PRODUCTS TAB ────────────────────────────────────────────────── */}
        {tab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                Products ({products.length})
              </h2>
              <button
                onClick={openAddProduct}
                className="flex items-center gap-2 bg-white text-amber-700 px-6 py-3 rounded-2xl font-bold shadow-xl hover:bg-amber-50 transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" /> Add Product
              </button>
            </div>

            {productsLoading ? (
              <p className="text-white text-xl drop-shadow-lg">Loading products...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => {
                  const optimizedImage = product.image?.replace(
                    '/upload/',
                    '/upload/w_400,h_400,c_fill,q_auto,f_auto/'
                  );
                  return (
                    <div
                      key={product._id}
                      className="bg-white/30 backdrop-blur-lg rounded-3xl border-2 border-white/40 shadow-xl overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-square w-full bg-white/20">
                        <img
                          src={optimizedImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400?text=No+Image';
                          }}
                        />
                        <span className={`absolute top-2 right-2 text-xs font-bold px-3 py-1 rounded-full shadow-md ${product.stock > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                          {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                        </span>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <span className="text-xs font-semibold text-amber-200 bg-white/20 px-2 py-1 rounded w-fit mb-1">
                          {product.category}
                        </span>
                        <h3 className="text-base font-bold text-white drop-shadow line-clamp-2 flex-1">
                          {product.name}
                        </h3>
                        <p className="text-2xl font-bold text-white drop-shadow-lg mt-1">
                          KSh {product.price.toFixed(2)}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => openEditProduct(product)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-white text-amber-700 py-2.5 rounded-2xl font-bold text-sm shadow-lg hover:bg-amber-50 transition-all transform hover:scale-105"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product._id)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/80 text-white py-2.5 rounded-2xl font-bold text-sm shadow-lg hover:bg-red-600 transition-all transform hover:scale-105"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ──────────────────────────────────────────────────── */}
        {tab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                Orders ({orders.length})
              </h2>
            </div>

            {/* Order Filters */}
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'all',       label: `All (${orders.length})` },
                { key: 'unpaid',    label: `Unpaid (${orders.filter(o => !o.isPaid && o.status !== 'Cancelled').length})` },
                { key: 'paid',      label: `Paid (${orders.filter(o => o.isPaid).length})` },
                { key: 'cancelled', label: `Cancelled (${orders.filter(o => o.status === 'Cancelled').length})` },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setOrderFilter(key)}
                  className={`px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all transform hover:scale-105 ${
                    orderFilter === key
                      ? 'bg-white text-amber-700 shadow-xl'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-2 border-white/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {ordersLoading ? (
              <p className="text-white text-xl drop-shadow-lg">Loading orders...</p>
            ) : filteredOrders.length === 0 ? (
              <Section>
                <div className="p-12 text-center text-white drop-shadow-lg text-lg font-semibold">
                  No orders found
                </div>
              </Section>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrder === order._id;
                  const form = orderStatusForm[order._id] || { status: order.status, adminResponse: order.adminResponse || '' };

                  return (
                    <div
                      key={order._id}
                      className="bg-white/30 backdrop-blur-lg rounded-3xl border-2 border-white/40 shadow-xl overflow-hidden"
                    >
                      {/* Order Header Row */}
                      <div className="p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-white/80 font-mono drop-shadow">
                            #{order._id.slice(-10)}
                          </p>
                          <p className="text-white font-bold drop-shadow">
                            {order.user?.name || 'Unknown'}{' '}
                            <span className="font-normal text-white/80 text-sm">
                              {order.user?.email}
                            </span>
                          </p>
                          <p className="text-white/70 text-sm drop-shadow">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow ${STATUS_STYLES[order.status]}`}>
                            {order.status}
                          </span>
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow ${order.isPaid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            {order.isPaid ? '✓ Paid' : 'Not Paid'}
                          </span>
                          <span className="text-white font-bold drop-shadow-lg text-lg">
                            KSh {order.totalPrice.toFixed(2)}
                          </span>
                          <button
                            onClick={() => initOrderForm(order)}
                            className="flex items-center gap-1.5 bg-white text-amber-700 px-4 py-2 rounded-2xl font-bold text-sm shadow-lg hover:bg-amber-50 transition-all transform hover:scale-105"
                          >
                            <Eye className="w-4 h-4" />
                            {isExpanded ? 'Close' : 'Manage'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Order Detail */}
                      {isExpanded && (
                        <div className="border-t-2 border-white/30 p-5 space-y-5">

                          {/* Order Items */}
                          <div>
                            <h4 className="text-white font-bold mb-3 drop-shadow-lg">Items</h4>
                            <div className="space-y-2">
                              {order.orderItems.map((item) => (
                                <div key={item._id} className="flex items-center gap-3 bg-white/20 rounded-2xl p-3 border border-white/30">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-xl shadow"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Item'; }}
                                  />
                                  <div className="flex-1">
                                    <p className="text-white font-semibold text-sm drop-shadow">{item.name}</p>
                                    <p className="text-white/70 text-xs">Qty: {item.quantity} × KSh {item.price.toFixed(2)}</p>
                                  </div>
                                  <p className="text-white font-bold drop-shadow">
                                    KSh {(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping Info */}
                          {order.shippingAddress && (
                            <div className="bg-white/20 rounded-2xl p-4 border border-white/30">
                              <h4 className="text-white font-bold mb-2 drop-shadow-lg text-sm">Shipping Details</h4>
                              <div className="text-white/80 text-sm space-y-0.5">
                                {order.shippingAddress.name && <p>{order.shippingAddress.name}</p>}
                                {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                                {order.shippingAddress.mpesaPhone && <p>M-Pesa: {order.shippingAddress.mpesaPhone}</p>}
                                {order.shippingAddress.address && <p>Address: {order.shippingAddress.address}</p>}
                              </div>
                            </div>
                          )}

                          {/* Update Status */}
                          <div className="bg-white/20 rounded-2xl p-4 border border-white/30 space-y-3">
                            <h4 className="text-white font-bold drop-shadow-lg text-sm">Update Order</h4>

                            <div>
                              <label className="text-white/80 text-xs font-semibold mb-1 block drop-shadow">Status</label>
                              <div className="relative">
                                <select
                                  value={form.status}
                                  onChange={(e) =>
                                    setOrderStatusForm((prev) => ({
                                      ...prev,
                                      [order._id]: { ...form, status: e.target.value },
                                    }))
                                  }
                                  className="w-full appearance-none bg-white/90 text-gray-800 font-semibold px-4 py-3 rounded-2xl border-2 border-amber-200 focus:outline-none focus:border-amber-500 shadow pr-10"
                                >
                                  {ORDER_STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700 pointer-events-none" />
                              </div>
                            </div>

                            <div>
                              <label className="text-white/80 text-xs font-semibold mb-1 block drop-shadow">
                                Message to Customer (optional)
                              </label>
                              <textarea
                                rows={2}
                                value={form.adminResponse}
                                onChange={(e) =>
                                  setOrderStatusForm((prev) => ({
                                    ...prev,
                                    [order._id]: { ...form, adminResponse: e.target.value },
                                  }))
                                }
                                placeholder="e.g. Your order has been dispatched via courier"
                                className="w-full bg-white/90 text-gray-800 px-4 py-3 rounded-2xl border-2 border-amber-200 focus:outline-none focus:border-amber-500 shadow resize-none text-sm"
                              />
                            </div>

                            <button
                              onClick={() => handleOrderStatusSave(order._id)}
                              disabled={orderSaving === order._id}
                              className="flex items-center gap-2 bg-white text-amber-700 px-6 py-3 rounded-2xl font-bold shadow-xl hover:bg-amber-50 transition-all transform hover:scale-105 disabled:opacity-60"
                            >
                              <Save className="w-4 h-4" />
                              {orderSaving === order._id ? 'Saving...' : 'Save Changes'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── USERS TAB ───────────────────────────────────────────────────── */}
        {tab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              Users ({users.length})
            </h2>

            {usersLoading ? (
              <p className="text-white text-xl drop-shadow-lg">Loading users...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="bg-white/30 backdrop-blur-lg rounded-3xl border-2 border-white/40 shadow-xl p-5 flex items-center gap-4"
                  >
                    <div className="bg-white/30 w-14 h-14 rounded-full flex items-center justify-center border-2 border-white/40 flex-shrink-0">
                      <span className="text-2xl font-bold text-white drop-shadow-lg">
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-bold drop-shadow truncate">{u.name}</p>
                        {u.isAdmin && (
                          <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-white/70 text-sm truncate drop-shadow">{u.email}</p>
                      {u.phone && (
                        <p className="text-white/60 text-xs drop-shadow">{u.phone}</p>
                      )}
                      <p className="text-white/50 text-xs mt-1">
                        Joined {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── PRODUCT MODAL ─────────────────────────────────────────────────── */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-white/20 backdrop-blur-xl rounded-3xl border-2 border-white/40 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            style={bgStyle}
          >
            <div className="sticky top-0 bg-white/10 backdrop-blur-sm border-b-2 border-white/30 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-xl font-bold text-white drop-shadow-lg">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={closeProductModal}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full border border-white/30 transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">

              {/* Image Upload */}
              <div>
                <label className="text-white/80 text-sm font-semibold mb-2 block drop-shadow">
                  Product Image *
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative cursor-pointer border-2 border-dashed border-white/50 rounded-2xl overflow-hidden hover:border-white transition-colors"
                >
                  {productForm.image ? (
                    <img
                      src={productForm.image}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex flex-col items-center justify-center gap-2 bg-white/10">
                      <Upload className="w-10 h-10 text-white/60" />
                      <p className="text-white/60 text-sm">Click to upload image</p>
                    </div>
                  )}
                  {imageUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <p className="text-white font-semibold drop-shadow">Uploading...</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpg,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {productForm.image && (
                  <button
                    onClick={() => setProductForm((prev) => ({ ...prev, image: '' }))}
                    className="mt-2 text-xs text-white/70 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Change image
                  </button>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="text-white/80 text-sm font-semibold mb-1.5 block drop-shadow">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Organic Brown Rice 1kg"
                  className="w-full bg-white/90 text-gray-800 px-4 py-3 rounded-2xl border-2 border-amber-200 focus:outline-none focus:border-amber-500 shadow"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-white/80 text-sm font-semibold mb-1.5 block drop-shadow">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the product..."
                  className="w-full bg-white/90 text-gray-800 px-4 py-3 rounded-2xl border-2 border-amber-200 focus:outline-none focus:border-amber-500 shadow resize-none text-sm"
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/80 text-sm font-semibold mb-1.5 block drop-shadow">
                    Price (KSh) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="w-full bg-white/90 text-gray-800 px-4 py-3 rounded-2xl border-2 border-amber-200 focus:outline-none focus:border-amber-500 shadow"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm font-semibold mb-1.5 block drop-shadow">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))}
                    placeholder="0"
                    className="w-full bg-white/90 text-gray-800 px-4 py-3 rounded-2xl border-2 border-amber-200 focus:outline-none focus:border-amber-500 shadow"
                  />
                </div>
              </div>

              {/* Category & Sort Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/80 text-sm font-semibold mb-1.5 block drop-shadow">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full appearance-none bg-white/90 text-gray-800 font-semibold px-4 py-3 rounded-2xl border-2 border-amber-200 focus:outline-none focus:border-amber-500 shadow pr-10"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-white/80 text-sm font-semibold mb-1.5 block drop-shadow">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.sortOrder}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
                    placeholder="0"
                    className="w-full bg-white/90 text-gray-800 px-4 py-3 rounded-2xl border-2 border-amber-200 focus:outline-none focus:border-amber-500 shadow"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleProductSave}
                  disabled={productSaving || imageUploading}
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-amber-700 py-3.5 rounded-2xl font-bold shadow-xl hover:bg-amber-50 transition-all transform hover:scale-105 disabled:opacity-60"
                >
                  <Save className="w-5 h-5" />
                  {productSaving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
                <button
                  onClick={closeProductModal}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/20 text-white py-3.5 rounded-2xl font-semibold border-2 border-white/30 hover:bg-white/30 transition-all transform hover:scale-105"
                >
                  <X className="w-5 h-5" /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ───────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl border-2 border-white/40 shadow-2xl p-8 max-w-sm w-full"
            style={bgStyle}>
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-red-500/20 p-3 rounded-full border-2 border-red-400">
                <Trash2 className="w-7 h-7 text-white drop-shadow-lg" />
              </div>
              <h3 className="text-xl font-bold text-white drop-shadow-lg">Delete Product?</h3>
            </div>
            <p className="text-white/90 mb-6 drop-shadow">
              This will permanently delete the product and its image from Cloudinary. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteProduct(deleteConfirm)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3.5 rounded-full font-bold shadow-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-white/20 text-white px-6 py-3.5 rounded-full font-semibold border-2 border-white/30 hover:bg-white/30 transition-all transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;