import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import generalBackground from '../assets/images/backgrounds/general-bg.jpg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(210,180,140,0.85), rgba(181,136,99,0.85)), url(${generalBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-md w-full">
        <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-8 border border-white/40">

          {!sent ? (
            <>
              {/* Header */}
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white drop-shadow-lg">Forgot Password?</h2>
                <p className="mt-3 text-white/90 text-lg drop-shadow">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white drop-shadow mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full pl-10 pr-4 py-3 border border-white/40 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-white/50 focus:border-white transition shadow-sm placeholder-gray-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/30 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-white font-semibold hover:underline drop-shadow transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-white/20 p-5 rounded-full border-2 border-white/40 shadow-lg">
                  <CheckCircle className="w-14 h-14 text-white drop-shadow-lg" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">Check Your Email</h2>
              <p className="text-white/90 text-base drop-shadow leading-relaxed">
                If an account with <span className="font-bold">{email}</span> exists, we've sent a password reset link. It will expire in <span className="font-bold">15 minutes</span>.
              </p>
              <p className="text-white/70 text-sm drop-shadow">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  onClick={() => setSent(false)}
                  className="text-white font-bold hover:underline transition"
                >
                  try again
                </button>
                .
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-all duration-300 shadow-lg border-2 border-white/30 backdrop-blur-sm transform hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;