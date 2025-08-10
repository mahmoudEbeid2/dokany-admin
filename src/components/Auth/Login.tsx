import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Shield,
  Sparkles,
  Eye,
  EyeOff,
  Loader,
} from "lucide-react";
import axios from "axios";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";
import { API_CONFIG } from "../../config/api";
import { Link } from "react-router-dom";
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError(false);
    setPasswordError(false);

    if (!validateEmail(email)) {
      setEmailError(true);
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(true);
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    dispatch(loginStart());

    try {
      const res = await axios.post(`${API_CONFIG.BASE_URL}/auth/admin/login`, {
        email,
        password,
      });

      const { user, token } = res.data;
      localStorage.setItem("token", token);
      dispatch(loginSuccess(user));
      navigate("/dashboard");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setError(message);
      dispatch(loginFailure());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <Sparkles className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-gray-600 text-base">
              Welcome back! Please sign in to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                    emailError
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200"
                  }`}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {error}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                    passwordError
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200"
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && !error && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  Password must be at least 6 characters long.
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 p-3 rounded-xl text-sm flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Signing In...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </span>
              )}
            </button>
          </form>
          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Secure access to your admin dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
