import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ShoppingCart, Package } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import heroBackground from '../assets/images/backgrounds/hero-bg.jpg';
import featuresBackground from '../assets/images/backgrounds/features-bg.jpg';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
      setLoading(false);
    } catch {
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const categories = ['All', 'Cereals', 'Spices', 'Grains', 'Beverages', 'Snacks', 'Other'];

  const categoryFilteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const stockFilteredProducts = categoryFilteredProducts.filter((product) => {
    if (stockFilter === 'instock') return product.stock > 0;
    if (stockFilter === 'outofstock') return product.stock === 0;
    return true;
  });

  const filteredProducts = stockFilteredProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => setSearchQuery('');

  const inStockCount = categoryFilteredProducts.filter((p) => p.stock > 0).length;
  const outOfStockCount = categoryFilteredProducts.filter((p) => p.stock === 0).length;

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(210,180,140,0.85), rgba(181,136,99,0.85)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="text-2xl text-white font-semibold drop-shadow-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Creamy Brown Gradient */}
      <section
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(210,180,140,0.85), rgba(181,136,99,0.85)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight"
              style={{
                textShadow: '3px 3px 10px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)',
              }}
            >
              Explore Our Products
            </h1>
            <p
              className="text-xl md:text-3xl mb-8 opacity-95 leading-relaxed font-light"
              style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.5)' }}
            >
              Quality cereals, spices, grains and much more delivered to you.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section - Elegant Creamy Gradient */}
      <section
        className="relative"
        style={{
          backgroundImage: `linear-gradient(rgba(210,180,140,0.85), rgba(181,136,99,0.85)), url(${featuresBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          
          {/* Search Bar - More Elegant */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-amber-700 group-focus-within:text-amber-800 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-14 pr-14 py-4 border-2 border-white/30 rounded-2xl bg-white/95 backdrop-blur-md focus:ring-4 focus:ring-amber-500/20 focus:border-amber-700 transition-all shadow-lg hover:shadow-xl text-lg"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center hover:scale-110 transition-transform"
                >
                  <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-white mt-3 text-center font-medium drop-shadow-lg">
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </p>
            )}
          </div>

          {/* Category Filters - Navbar Style */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-white mb-5 drop-shadow-lg">Categories</h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-2xl font-semibold text-base transition-all transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-white text-amber-700 shadow-xl'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-2 border-white/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Status Filters - Navbar Style */}
          <div className="mb-14">
            <h3 className="text-xl font-bold text-white mb-5 drop-shadow-lg">Stock Status</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setStockFilter('all')}
                className={`px-6 py-3 rounded-2xl font-semibold text-base transition-all transform hover:scale-105 ${
                  stockFilter === 'all'
                    ? 'bg-white text-amber-700 shadow-xl'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-2 border-white/30'
                }`}
              >
                All ({categoryFilteredProducts.length})
              </button>
              <button
                onClick={() => setStockFilter('instock')}
                className={`px-6 py-3 rounded-2xl font-semibold text-base transition-all transform hover:scale-105 flex items-center gap-2 ${
                  stockFilter === 'instock'
                    ? 'bg-green-600 text-white shadow-xl'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-2 border-white/30'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${stockFilter === 'instock' ? 'bg-white' : 'bg-green-500'}`}></span>
                In Stock ({inStockCount})
              </button>
              <button
                onClick={() => setStockFilter('outofstock')}
                className={`px-6 py-3 rounded-2xl font-semibold text-base transition-all transform hover:scale-105 flex items-center gap-2 ${
                  stockFilter === 'outofstock'
                    ? 'bg-red-600 text-white shadow-xl'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-2 border-white/30'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${stockFilter === 'outofstock' ? 'bg-white' : 'bg-red-500'}`}></span>
                Out of Stock ({outOfStockCount})
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-16 max-w-md mx-auto border-2 border-amber-100">
                <div className="bg-gradient-to-br from-amber-100 to-amber-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Package className="w-16 h-16 text-amber-700" />
                </div>
                <p className="text-xl text-gray-700 font-semibold mb-4">
                  {searchQuery
                    ? `No products found matching "${searchQuery}"`
                    : stockFilter === 'instock'
                    ? 'No products in stock for this category'
                    : stockFilter === 'outofstock'
                    ? 'No out of stock products in this category'
                    : 'No products found in this category'}
                </p>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="mt-4 px-6 py-3 bg-white text-amber-700 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-xl transform hover:scale-105"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const isInStock = product.stock > 0;
                return (
                  <div 
                    key={product._id} 
                    className="group relative bg-white/90 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-amber-100 transform hover:scale-105"
                  >
                    {/* Product Image Container */}
                    <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x400?text=Product';
                        }}
                      />
                      
                      {/* Stock Badge - Top Right */}
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

                      {/* Low Stock Warning - Bottom */}
                      {isInStock && product.stock < 10 && (
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="block w-full text-center bg-gradient-to-r from-orange-400 to-orange-500 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-white rounded-full shadow-lg">
                            Only {product.stock} left!
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <h3 className="text-base font-bold text-gray-900 line-clamp-2 min-h-[3rem] mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        {product.description}
                      </p>
                      
                      {/* Price */}
                      <div className="mb-4">
                        <p className="text-2xl font-bold text-amber-700">
                          KSh {product.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Add to Cart Button - Navbar Style */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!isInStock}
                        className={`w-full flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base font-bold transition-all transform hover:scale-105 active:scale-95 ${
                          !isInStock
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-white text-amber-700 hover:bg-gray-100 shadow-xl hover:shadow-2xl'
                        }`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        {!isInStock ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;