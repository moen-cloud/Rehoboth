import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import generalBackground from '../assets/images/backgrounds/general-bg.jpg';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password: formData.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed. The link may have expired.');
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

          {!success ? (
            <>
              {/* Header */}
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white drop-shadow-lg">New Password</h2>
                <p className="mt-3 text-white/90 text-lg drop-shadow">
                  Choose a strong new password for your account.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-white drop-shadow mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="block w-full pl-10 pr-12 py-3 border border-white/40 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-white/50 focus:border-white transition shadow-sm placeholder-gray-500"
                      placeholder="Min. 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-white drop-shadow mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-12 py-3 border border-white/40 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-white/50 focus:border-white transition shadow-sm placeholder-gray-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition"
                    >
                      {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {/* Match indicator */}
                  {formData.confirmPassword && (
                    <p className={`text-xs mt-1.5 font-medium drop-shadow ${formData.password === formData.confirmPassword ? 'text-green-200' : 'text-red-200'}`}>
                      {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/30 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Resetting...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-white/20 p-5 rounded-full border-2 border-white/40 shadow-lg">
                  <CheckCircle className="w-14 h-14 text-white drop-shadow-lg" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">Password Reset!</h2>
              <p className="text-white/90 text-base drop-shadow leading-relaxed">
                Your password has been successfully updated. Redirecting you to login...
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-all duration-300 shadow-lg border-2 border-white/30 backdrop-blur-sm transform hover:scale-105"
              >
                Go to Login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;