import { useContext } from 'react';
import { ShoppingCart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const isInStock = product.stock > 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-amber-100">
      <div className="w-full h-56 bg-gray-100 flex items-center justify-center p-4 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Product';
          }}
        />
        {/* Stock Badge */}
        {isInStock ? (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            In Stock
          </span>
        ) : (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            Out of Stock
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded w-fit">
          {product.category}
        </span>
        <h3 className="text-lg font-semibold mt-2 mb-1 text-gray-900">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-amber-700">
              KSh {product.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              !isInStock
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-amber-700 hover:bg-amber-800 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{!isInStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
          {isInStock && product.stock < 10 && (
            <p className="text-xs text-orange-600 font-semibold mt-2 text-center bg-orange-50 py-1 rounded">
              Only {product.stock} left in stock!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;