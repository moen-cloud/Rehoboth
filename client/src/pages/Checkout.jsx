import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { User, Phone, MapPin, CreditCard } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import generalBackground from '../assets/images/backgrounds/general-bg.jpg';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    mpesaPhone: user?.phone || '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          mpesaPhone: formData.mpesaPhone,
          address: formData.address,
        },
        paymentMethod: 'M-Pesa',
        totalPrice: getCartTotal() + 200,
      };

      const { data: order } = await api.post('/orders', orderData);

      const paymentData = {
        phone: formData.mpesaPhone.replace(/^0/, '254'),
        amount: order.totalPrice,
        orderId: order._id,
      };

      const { data: payment } = await api.post('/mpesa/stkpush', paymentData);

      if (payment.ResponseCode === '0') {
        toast.success('Payment request sent! Please check your phone.');
        clearCart();
        navigate(`/orders`);
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
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
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-3 text-white tracking-tight drop-shadow-lg">Checkout</h1>
          <p className="text-white/90 text-lg drop-shadow">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delivery Information Form */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white/30 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border-2 border-white/40">
              <h2 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">Delivery Information</h2>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-white mb-3 drop-shadow">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="block w-full pl-12 pr-4 py-4 border-2 border-white/40 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-white/30 focus:border-white transition-all shadow-lg text-lg placeholder-gray-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-bold text-white mb-3 drop-shadow">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="block w-full pl-12 pr-4 py-4 border-2 border-white/40 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-white/30 focus:border-white transition-all shadow-lg text-lg placeholder-gray-500"
                      placeholder="0712345678"
                    />
                  </div>
                </div>

                {/* M-Pesa Phone Number */}
                <div>
                  <label className="block text-sm font-bold text-white mb-3 drop-shadow">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="tel"
                      name="mpesaPhone"
                      value={formData.mpesaPhone}
                      onChange={handleChange}
                      required
                      className="block w-full pl-12 pr-4 py-4 border-2 border-white/40 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-white/30 focus:border-white transition-all shadow-lg text-lg placeholder-gray-500"
                      placeholder="0712345678"
                    />
                  </div>
                  <p className="text-xs text-white/90 mt-2 ml-1 drop-shadow">
                    Enter your M-Pesa number to receive payment prompt
                  </p>
                </div>

                {/* Physical Address */}
                <div>
                  <label className="block text-sm font-bold text-white mb-3 drop-shadow">
                    Physical Address
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-500" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="block w-full pl-12 pr-4 py-4 border-2 border-white/40 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-white/30 focus:border-white transition-all shadow-lg resize-none text-lg placeholder-gray-500"
                      placeholder="Enter your delivery address"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-gradient-to-r from-green-500 to-green-600 text-white py-5 rounded-full font-medium text-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    Pay with M-Pesa
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white/30 backdrop-blur-lg p-8 rounded-3xl shadow-2xl sticky top-24 border-2 border-white/40">
              <h2 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">Order Summary</h2>

              <div className="space-y-5 mb-8">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 p-4 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl shadow-md"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Product';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-white drop-shadow">{item.name}</h3>
                      <p className="text-sm text-white/90 drop-shadow">
                        Qty: {item.quantity} × KSh {item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-white drop-shadow-lg">
                        KSh {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t-2 border-white/30 pt-6">
                <div className="flex justify-between text-white text-lg drop-shadow">
                  <span>Subtotal</span>
                  <span className="font-semibold">KSh {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white text-lg drop-shadow">
                  <span>Delivery</span>
                  <span className="font-semibold">KSh 200.00</span>
                </div>
                <div className="border-t-2 border-white/30 pt-4 flex justify-between">
                  <span className="text-xl font-bold text-white drop-shadow-lg">Total</span>
                  <span className="text-3xl font-bold text-white drop-shadow-lg">
                    KSh {(getCartTotal() + 200).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;