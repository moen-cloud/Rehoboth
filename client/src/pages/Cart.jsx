import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react'; // Removed ShoppingBag
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import generalBackground from '../assets/images/backgrounds/general-bg.jpg';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
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
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-lg mx-auto bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl p-12 sm:p-16 border-2 border-white/40">

            {/* Removed ShoppingBag icon */}

            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white drop-shadow-lg">Your cart is empty</h2>
            <p className="text-white/90 text-base sm:text-lg mb-8 drop-shadow">
              Looks like you haven't added anything yet
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-3 bg-white/20 text-white px-8 sm:px-10 py-3 sm:py-4 
              rounded-full font-medium hover:bg-white/30 transition-all duration-300 shadow-lg 
              hover:shadow-xl transform hover:scale-105 border-2 border-white/30 backdrop-blur-sm"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
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
      <div className="container mx-auto px-3 sm:px-4 py-10 sm:py-12">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 text-white tracking-tight drop-shadow-lg">
            Shopping Cart
          </h1>
          <p className="text-white/90 text-base sm:text-lg drop-shadow">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-xl p-4 sm:p-6 
                hover:shadow-2xl transition-all duration-300 border-2 border-white/40 
                transform hover:scale-[1.01]"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

                  {/* Product Image */}
                  <div className="w-full h-32 xs:h-36 sm:w-40 sm:h-40 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-2xl shadow-md"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Product';
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg sm:text-xl text-white mb-1 sm:mb-2 drop-shadow-lg">
                        {item.name}
                      </h3>
                      <p className="text-white/90 text-sm sm:text-base drop-shadow">
                        KSh {item.price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity + Remove */}
                    <div className="flex items-center justify-between mt-4 sm:mt-6">

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 sm:gap-3 bg-white/20 backdrop-blur-sm rounded-full p-1.5 sm:p-2 border-2 border-white/30 shadow-lg">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-2 hover:bg-white/30 rounded-full transition-all"
                        >
                          <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </button>

                        <span className="w-10 sm:w-16 text-center font-bold text-base sm:text-lg text-white drop-shadow">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-2 hover:bg-white/30 rounded-full transition-all"
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </button>
                      </div>

                      {/* Price + Remove */}
                      <div className="text-right">
                        <p className="font-bold text-xl sm:text-2xl text-white mb-2 sm:mb-3 drop-shadow-lg">
                          KSh {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-300 hover:text-red-100 transition flex items-center gap-1.5 sm:gap-2 font-semibold hover:underline drop-shadow"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base">Remove</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 sticky top-24 border-2 border-white/40">
              
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white drop-shadow-lg">
                Order Summary
              </h2>

              <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
                <div className="flex justify-between text-white text-base sm:text-lg drop-shadow">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">KSh {getCartTotal().toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-white text-base sm:text-lg drop-shadow">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">KSh 200.00</span>
                </div>

                <div className="border-t-2 border-white/30 pt-4 sm:pt-5 flex justify-between">
                  <span className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">Total</span>
                  <span className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                    KSh {(getCartTotal() + 200).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-white/20 text-white py-4 sm:py-5 rounded-full font-medium 
                text-base sm:text-lg hover:bg-white/30 transition-all duration-300 shadow-lg 
                hover:shadow-xl transform hover:scale-105 border-2 border-white/30 backdrop-blur-sm 
                flex items-center justify-center gap-2 sm:gap-3"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <Link
                to="/products"
                className="block text-center mt-5 sm:mt-6 text-white hover:text-white/80 font-medium 
                transition text-base sm:text-lg hover:underline drop-shadow"
              >
                ← Continue Shopping
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
