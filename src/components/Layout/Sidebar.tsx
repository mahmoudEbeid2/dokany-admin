import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { Users, UserCheck, BarChart3, Palette, LogOut, Shield, DollarSign, User, Sparkles } from 'lucide-react';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      dispatch(logout());
      navigate('/login');
    }
  };

  const navigationItems = [
    { 
      to: '/dashboard/analytics', 
      icon: BarChart3, 
      label: 'Analytics',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    { 
      to: '/dashboard/sellers', 
      icon: Users, 
      label: 'Sellers',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    { 
      to: '/dashboard/managers', 
      icon: UserCheck, 
      label: 'Managers',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    { 
      to: '/dashboard/themes', 
      icon: Palette, 
      label: 'Themes',
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'hover:from-pink-600 hover:to-pink-700'
    },
    { 
      to: '/dashboard/payouts', 
      icon: DollarSign, 
      label: 'Payouts',
      color: 'from-yellow-500 to-yellow-600',
      hoverColor: 'hover:from-yellow-600 hover:to-yellow-700'
    },
    { 
      to: '/dashboard/profile', 
      icon: User, 
      label: 'My Profile',
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700'
    },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm h-screen w-64 shadow-2xl border-r border-gray-100 flex flex-col hidden lg:block">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <div className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3 text-purple-500" />
              <p className="text-sm text-gray-500">Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map(({ to, icon: Icon, label, color, hoverColor }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 ${
                isActive
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-md'
              }`
            }
          >
            <div className={`p-2 rounded-lg transition-all duration-200 ${
              ({ isActive }: { isActive: boolean }) => isActive 
                ? 'bg-white/20' 
                : 'bg-gray-100 group-hover:bg-white/80'
            }`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
        <button
          onClick={handleLogout}
          className="group flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-all duration-200">
            <LogOut className="h-5 w-5 rotate-180" />
          </div>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;