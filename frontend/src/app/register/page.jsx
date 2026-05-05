// "use client";
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { clearError } from "../../../features/auth/authSlice";
// import Link from "next/link";
// import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
// import { registerUser } from "../../../features/auth/authActions";
// import { useRouter } from "next/navigation"; // ✅
// const page = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [validationError, setValidationError] = useState("");

//   const dispatch = useDispatch();
//   const router = useRouter();
  
//   // Get state from Redux
//   const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

//   // Clear errors when component mounts
//   useEffect(() => {
//     dispatch(clearError());
//     setValidationError("");
//   }, [dispatch]);

//   // Redirect if registration is successful
//   useEffect(() => {
//     if (isAuthenticated) {
//       router.push("/dashboard"); 
//     }
//   }, [isAuthenticated, router]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setValidationError("");

//     // Basic Validation
//     if (formData.password !== formData.confirmPassword) {
//       setValidationError("Passwords do not match");
//       return;
//     }

//     if (formData.password.length < 6) {
//       setValidationError("Password must be at least 6 characters");
//       return;
//     }

//     // Dispatch the provided register action
//     // Note: We exclude confirmPassword from the API call
//     const { name, email, password } = formData;
//     dispatch(registerUser({ name, email, password }));
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-100">
        
//         {/* Header */}
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
//             Create Account
//           </h1>
//           <p className="text-slate-500 text-sm">
//             Join us today! It only takes a minute.
//           </p>
//         </div>

//         {/* Error Alerts (Redux Error or Local Validation Error) */}
//         {(error || validationError) && (
//           <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm animate-shake">
//             <AlertCircle size={18} />
//             <p>{error || validationError}</p>
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
          
//           {/* Full Name */}
//           <div className="space-y-1">
//             <label className="text-sm font-medium text-slate-700 ml-1">
//               Full Name
//             </label>
//             <div className="relative group">
//               <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
//               <input
//                 type="text"
//                 name="name"
//                 required
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="John Doe"
//                 className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div className="space-y-1">
//             <label className="text-sm font-medium text-slate-700 ml-1">
//               Email Address
//             </label>
//             <div className="relative group">
//               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
//               <input
//                 type="email"
//                 name="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="name@company.com"
//                 className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div className="space-y-1">
//             <label className="text-sm font-medium text-slate-700 ml-1">
//               Password
//             </label>
//             <div className="relative group">
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
//               <input
//                 type="password"
//                 name="password"
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="••••••••"
//                 className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
//               />
//             </div>
//           </div>

//           {/* Confirm Password */}
//           <div className="space-y-1">
//             <label className="text-sm font-medium text-slate-700 ml-1">
//               Confirm Password
//             </label>
//             <div className="relative group">
//               <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 required
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 placeholder="••••••••"
//                 className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 mt-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="animate-spin" size={20} />
//                 Creating account...
//               </>
//             ) : (
//               "Sign Up"
//             )}
//           </button>
//         </form>

//         {/* Footer */}
//         <p className="text-center text-slate-600 text-sm pt-2">
//           Already have an account?{" "}
//           <Link
//             href="/login"
//             className="text-blue-600 font-bold hover:underline underline-offset-4"
//           >
//             Sign In
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default page;

"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../../features/auth/authSlice";
import Link from "next/link";
import { 
  Mail, 
  Lock, 
  User, 
  Phone, // Added for phoneNumber
  Loader2, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react";
import { registerUser } from "../../features/auth/authActions";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "", // Added to match schema
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    setValidationError("");
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard"); 
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    // Prepare data based on your Mongoose Schema
    // (role, isVerified, isActive, and refreshToken are handled by the backend)
    const { name, email, password, phoneNumber } = formData;
    dispatch(registerUser({ name, email, password, phoneNumber }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-100">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm">
            Join us today! It only takes a minute.
          </p>
        </div>

        {/* Error Alerts */}
        {(error || validationError) && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm animate-shake">
            <AlertCircle size={18} />
            <p>{error || validationError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          {/* Phone Number - NEW FIELD FROM SCHEMA */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Phone Number</label>
            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="tel"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Confirm Password</label>
            <div className="relative group">
              <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 mt-2 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={20} /> Creating account...</>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-600 text-sm pt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;