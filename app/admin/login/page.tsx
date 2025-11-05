"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main login page - role-based redirect is handled there
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-white">Redirecting to Login...</h1>
        <p className="text-gray-300">Please wait...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
