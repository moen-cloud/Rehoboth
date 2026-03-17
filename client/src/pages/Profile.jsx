import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Lock, Eye, EyeOff, User, Mail, Phone, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import generalBackground from '../assets/images/backgrounds/general-bg.jpg';

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success('Password changed successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(210,180,140,0.85), rgba(181,136,99,0.85)), url(${generalBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
            My Profile
          </h1>
          <p className="text-white/80 text-lg mt-1 drop-shadow">
            Manage your account details
          </p>
        </div>

        {/* Account Info Card */}
        <div className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/40 p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 p-3 rounded-2xl border-2 border-white/40">
              <User className="w-6 h-6 text-white drop-shadow" />
            </div>
            <h2 className="text-xl font-bold text-white drop-shadow-lg">Account Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="bg-white/20 rounded-2xl p-4 border border-white/30">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-white/70" />
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wide drop-shadow">Full Name</p>
              </div>
              <p className="text-white font-bold text-base drop-shadow">{user?.name}</p>
            </div>

            {/* Email */}
            <div className="bg-white/20 rounded-2xl p-4 border border-white/30">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-white/70" />
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wide drop-shadow">Email</p>
              </div>
              <p className="text-white font-bold text-base drop-shadow truncate">{user?.email}</p>
            </div>

            {/* Phone */}
            <div className="bg-white/20 rounded-2xl p-4 border border-white/30">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4 text-white/70" />
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wide drop-shadow">Phone</p>
              </div>
              <p className="text-white font-bold text-base drop-shadow">{user?.phone || '—'}</p>
            </div>

            {/* Role */}
            <div className="bg-white/20 rounded-2xl p-4 border border-white/30">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-white/70" />
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wide drop-shadow">Role</p>
              </div>
              <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full ${user?.isAdmin ? 'bg-amber-500 text-white' : 'bg-white/30 text-white border border-white/40'}`}>
                {user?.isAdmin ? 'Admin' : 'Customer'}
              </span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/40 p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 p-3 rounded-2xl border-2 border-white/40">
              <Lock className="w-6 h-6 text-white drop-shadow" />
            </div>
            <h2 className="text-xl font-bold text-white drop-shadow-lg">Change Password</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-white drop-shadow mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-white/40 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-white/50 focus:border-white transition shadow-sm placeholder-gray-500"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition"
                >
                  {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

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
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="block w-full pl-10 pr-12 py-3 border border-white/40 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-white/50 focus:border-white transition shadow-sm placeholder-gray-500"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition"
                >
                  {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
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
              {formData.confirmPassword && (
                <p className={`text-xs mt-1.5 font-medium drop-shadow ${formData.newPassword === formData.confirmPassword ? 'text-green-200' : 'text-red-200'}`}>
                  {formData.newPassword === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/30 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Updating...
                </span>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;