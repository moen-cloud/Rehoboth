import { Link } from 'react-router-dom';
import heroBackground from '../assets/images/backgrounds/hero-bg.jpg';
import featuresBackground from '../assets/images/backgrounds/features-bg.jpg';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-r from-amber-700 to-amber-800 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(210,180,140,0.85), rgba(181,136,99,0.85)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
              style={{
                textShadow: '2px 2px 8px rgba(0,0,0,0.4), 0 0 20px rgba(0,0,0,0.3)'
              }}
            >
              Welcome to Rehoboth Store
            </h1>
            <p 
              className="text-lg md:text-2xl mb-8 opacity-95 leading-relaxed"
              style={{
                textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
              }}
            >
              Your one-stop destination for quality cereals, spices, grains, and general items.
              Fresh, affordable, and delivered to your doorstep!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-amber-700 px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transform hover:scale-105 active:scale-95"
            >
              Shop Now
              <span className="text-2xl">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div 
        className="relative"
        style={{
          backgroundImage: `linear-gradient(rgba(210,180,140,0.85), rgba(181,136,99,0.85)), url(${featuresBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">

            {/* Wide Selection */}
            <div className="bg-white/25 backdrop-blur-lg rounded-full px-6 py-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-white/30">
              <h3 className="text-xl font-bold mb-3 text-white drop-shadow-lg">Wide Selection</h3>
              <p className="text-white/90 leading-relaxed drop-shadow">
                Browse through our extensive range of quality products
              </p>
            </div>

            {/* Fast Delivery */}
            <div className="bg-white/25 backdrop-blur-lg rounded-full px-6 py-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-white/30">
              <h3 className="text-xl font-bold mb-3 text-white drop-shadow-lg">Fast Delivery</h3>
              <p className="text-white/90 leading-relaxed drop-shadow">
                Quick and reliable delivery to your location
              </p>
            </div>

            {/* Secure Payment */}
            <div className="bg-white/25 backdrop-blur-lg rounded-full px-6 py-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-white/30">
              <h3 className="text-xl font-bold mb-3 text-white drop-shadow-lg">Secure Payment</h3>
              <p className="text-white/90 leading-relaxed drop-shadow">
                Safe and secure M-Pesa payment integration
              </p>
            </div>

            {/* Quality Products */}
            <div className="bg-white/25 backdrop-blur-lg rounded-full px-6 py-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-white/30">
              <h3 className="text-xl font-bold mb-3 text-white drop-shadow-lg">Quality Products</h3>
              <p className="text-white/90 leading-relaxed drop-shadow">
                Only the best quality items for you
              </p>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="container mx-auto px-4 pb-20">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-5xl font-bold text-white mb-4"
              style={{ textShadow: '2px 2px 5px rgba(0,0,0,0.5)' }}
            >
              Shop by Category
            </h2>

            <p 
              className="text-white text-lg opacity-90"
              style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}
            >
              Explore our carefully curated selection
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            {['Cereals', 'Spices', 'Grains', 'Beverages', 'Snacks', 'Other'].map(
              (category) => (
                <Link
                  key={category}
                  to={`/products?category=${category}`}
                  className="bg-white/20 text-white px-6 py-6 rounded-full font-bold text-lg hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/30 backdrop-blur-sm text-center"
                >
                  {category}
                </Link>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;