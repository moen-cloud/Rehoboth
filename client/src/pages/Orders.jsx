import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { CreditCard, XCircle, AlertCircle, Calendar, Hash } from 'lucide-react'; 
// Removed Package
import generalBackground from '../assets/images/backgrounds/general-bg.jpg';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [paymentLoading, setPaymentLoading] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const retryPayment = async (order) => {
    setPaymentLoading(order._id);

    try {
      if (!order.shippingAddress || !order.shippingAddress.mpesaPhone) {
        toast.error('M-Pesa phone number is missing. Please contact support.');
        setPaymentLoading(null);
        return;
      }

      let phoneNumber = order.shippingAddress.mpesaPhone.trim();
      phoneNumber = phoneNumber.replace(/^0/, '254');
      phoneNumber = phoneNumber.replace(/^\+/, '');
      phoneNumber = phoneNumber.replace(/\s/g, '');

      const paymentData = {
        phone: phoneNumber,
        amount: Math.round(order.totalPrice),
        orderId: order._id,
      };

      const { data: payment } = await api.post('/mpesa/stkpush', paymentData);

      if (payment.ResponseCode === '0') {
        toast.success('Payment request sent! Check your phone.');
        setTimeout(fetchOrders, 3000);
      } else {
        toast.error(payment.ResponseDescription || 'Payment failed');
      }
    } catch (error) {
      toast.error('Payment failed. Try again.');
    } finally {
      setPaymentLoading(null);
    }
  };

  const cancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      await api.put(`/orders/${orderToCancel}/status`, {
        status: 'Cancelled',
        adminResponse: 'Order cancelled by customer'
      });
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      setOrderToCancel(null);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white',
      Processing: 'bg-gradient-to-r from-blue-400 to-blue-500 text-white',
      Shipped: 'bg-gradient-to-r from-purple-400 to-purple-500 text-white',
      Delivered: 'bg-gradient-to-r from-green-400 to-green-500 text-white',
      Cancelled: 'bg-gradient-to-r from-red-400 to-red-500 text-white',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'paid') return order.isPaid;
    if (filter === 'unpaid') return !order.isPaid && order.status !== 'Cancelled';
    if (filter === 'cancelled') return order.status === 'Cancelled';
    return true;
  });

  const paidCount = orders.filter(o => o.isPaid).length;
  const unpaidCount = orders.filter(o => !o.isPaid && o.status !== 'Cancelled').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(210,180,140,0.85), rgba(181,136,99,0.85)), url(${generalBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="text-2xl text-white font-semibold drop-shadow-lg">Loading orders...</div>
      </div>
    );
  }

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
      <div className="container mx-auto px-4 py-8 lg:py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white tracking-tight drop-shadow-lg">My Orders</h1>
          <p className="text-white text-lg drop-shadow">Track and manage your order history</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-white text-amber-700'
                  : 'bg-white/20 text-white hover:bg-white/30 border-2 border-white/30'
              }`}
            >
              All Orders ({orders.length})
            </button>

            <button
              onClick={() => setFilter('unpaid')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                filter === 'unpaid'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30 border-2 border-white/30'
              }`}
            >
              <AlertCircle className="w-5 h-5" /> Unpaid ({unpaidCount})
            </button>

            <button
              onClick={() => setFilter('paid')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                filter === 'paid'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30 border-2 border-white/30'
              }`}
            >
              <CreditCard className="w-5 h-5" /> Paid ({paidCount})
            </button>

            <button
              onClick={() => setFilter('cancelled')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                filter === 'cancelled'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30 border-2 border-white/30'
              }`}
            >
              <XCircle className="w-5 h-5" /> Cancelled ({cancelledCount})
            </button>
          </div>
        </div>

        {/* No Orders */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl p-16 max-w-md mx-auto border-2 border-white/40">

              {/* Removed Package icon */}

              <h2 className="text-3xl font-bold mb-3 text-white drop-shadow-lg">
                {filter === 'all' && 'No orders yet'}
                {filter === 'unpaid' && 'No unpaid orders'}
                {filter === 'paid' && 'No paid orders'}
                {filter === 'cancelled' && 'No cancelled orders'}
              </h2>

              {filter === 'all' && (
                <p className="text-white/90 text-lg drop-shadow">
                  Start shopping to create your first order!
                </p>
              )}
            </div>
          </div>
        ) : (

          /* Orders List */
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 border-2 border-white/40 transform hover:scale-[1.01]"
              >

                {/* Order Header */}
                <div className="bg-white/20 backdrop-blur-sm p-6 border-b-2 border-white/30">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white drop-shadow">
                        <Hash className="w-4 h-4" />
                        <p className="text-sm font-medium">
                          Order ID: <span className="font-mono text-xs bg-white/30 px-2 py-1 rounded-full">{order._id.slice(-12)}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-white drop-shadow">
                        <Calendar className="w-4 h-4" />
                        <p className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>

                      {order.isPaid ? (
                        <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg">✓ Paid</span>
                      ) : (
                        <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg">Not Paid</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4 text-white drop-shadow-lg">Order Items</h3>
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 p-4 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl shadow-md"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=Product';
                          }}
                        />

                        <div className="flex-1">
                          <h4 className="font-bold text-base md:text-lg text-white drop-shadow">{item.name}</h4>
                          <p className="text-sm text-white/90 mt-1 drop-shadow">
                            Qty: {item.quantity} × KSh {item.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-lg md:text-xl text-white drop-shadow-lg">
                            KSh {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="px-6 pb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30">

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-white drop-shadow-lg">Order Total</span>
                      <span className="text-3xl font-bold text-white drop-shadow-lg">
                        KSh {order.totalPrice.toFixed(2)}
                      </span>
                    </div>

                    {order.adminResponse && (
                      <div className="bg-white/30 backdrop-blur-sm border-l-4 border-blue-400 p-4 mb-4 rounded-lg shadow-md">
                        <p className="text-sm text-white drop-shadow">
                          <span className="font-bold">Admin Response:</span> {order.adminResponse}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 mt-4">

                      {/* Retry Payment */}
                      {!order.isPaid && order.status !== 'Cancelled' && (
                        <button
                          onClick={() => retryPayment(order)}
                          disabled={paymentLoading === order._id}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-full font-medium hover:from-green-600 hover:to-green-700 disabled:bg-gray-500 shadow-lg transform hover:scale-105"
                        >
                          <CreditCard className="w-5 h-5" />
                          {paymentLoading === order._id ? 'Processing...' : 'Retry Payment'}
                        </button>
                      )}

                      {/* Cancel Order */}
                      {!order.isPaid && order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                        <button
                          onClick={() => {
                            setOrderToCancel(order._id);
                            setShowCancelModal(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-full font-medium hover:from-red-600 hover:to-red-700 shadow-lg transform hover:scale-105"
                        >
                          <XCircle className="w-5 h-5" />
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-white/40">

              <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-500/20 p-3 rounded-full border-2 border-red-400">
                  <XCircle className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold text-white drop-shadow-lg">Cancel Order?</h3>
              </div>

              <p className="text-white mb-3 text-lg drop-shadow">
                Are you sure you want to cancel this order?
              </p>

              <p className="text-sm text-white/90 mb-8 bg-white/20 p-3 rounded-full border-2 border-white/30 drop-shadow">
                This order will remain visible for 7 days before being automatically removed.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={cancelOrder}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-full font-medium hover:from-red-600 hover:to-red-700 shadow-lg transform hover:scale-105"
                >
                  Yes, Cancel Order
                </button>

                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setOrderToCancel(null);
                  }}
                  className="flex-1 bg-white/20 text-white px-6 py-4 rounded-full font-medium hover:bg-white/30 border-2 border-white/30 shadow-lg transform hover:scale-105"
                >
                  Keep Order
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;
