"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect if we are in the browser AND auth check is actually finished
    if (mounted && !loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router, mounted]);

  // If we haven't mounted yet, return a blank space or a simple div 
  // that matches the server's initial render to avoid Hydration Error
  if (!mounted) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  // While Redux says we are loading or not logged in, show the spinner
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4 text-slate-600 font-medium">Checking authentication...</p>
      </div>
    );
  }

  // Finally, if authenticated, show the dashboard
  return <>{children}</>;
};

export default AuthGuard;