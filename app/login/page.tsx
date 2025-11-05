"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useLogin } from "@/hooks/api/useAuth";

export default function LoginPage() {
  const [user_email, setUserEmail] = useState("");
  const [user_pass, setUserPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const loginMutation = useLogin();

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isLoggedIn");
    const userRole = localStorage.getItem("userRole");

    if (userLoggedIn === "true") {
      // Redirect based on role
      if (userRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user_email || !user_pass) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await loginMutation.mutateAsync({
        user_email,
        user_pass,
      });
      toast.success("Login successful!");

      // Store user role in localStorage
      const userRole = response.data.user.role;
      localStorage.setItem("userRole", userRole);

      // If admin, set admin-authenticated flag
      if (userRole === "admin") {
        localStorage.setItem("admin-authenticated", "true");
        localStorage.setItem("adminEmail", response.data.user.user_email);
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      setError(error.message || "Login failed");
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex items-center justify-center min-h-screen px-4 pt-20">
        <Card className="w-full max-w-md bg-primary/5 border-primary/20 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-primary">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-gray-800">
              Sign in to your account (User or Admin)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-primary">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    name="user_email"
                    placeholder="Enter your email"
                    value={user_email}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="pl-10 bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-primary">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={user_pass}
                    onChange={(e) => setUserPass(e.target.value)}
                    className="pl-10 pr-10 bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-primary">
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 hover:text-primary" />
                    ) : (
                      <Eye className="h-4 w-4 hover:text-primary" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert className="bg-red-500/10 border-red-500/20">
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-secondary"
                disabled={loginMutation.isPending}>
                {loginMutation.isPending ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="text-center space-y-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-500">
                  Forgot your password?
                </Link>
                <div className="text-sm text-gray-800">
                  {"Don't have an account? "}
                  <Link
                    href="/signup"
                    className="text-blue-400 hover:text-blue-500">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
