"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { loginUser, clearError } from "@/redux/slices/authSlice"; // Adjust path accordingly
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { clearError } from "../../features/auth/authSlice";
import { loginUser } from "../../features/auth/authActions";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  
  // Get state from Redux
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect if logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard"); // Change to your desired route
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-100">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm">
            Please enter your details to sign in
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm animate-shake">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-600 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-bold hover:underline underline-offset-4"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;