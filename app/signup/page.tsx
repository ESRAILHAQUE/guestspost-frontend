"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { useRegister } from "@/hooks/api/useAuth";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user_nicename: "",
    user_email: "",
    user_pass: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = useRegister();

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_nicename.trim()) {
      newErrors.user_nicename = "Full name is required";
    }

    if (!formData.user_email.trim()) {
      newErrors.user_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.user_email)) {
      newErrors.user_email = "Please enter a valid email address";
    }

    if (!formData.user_pass) {
      newErrors.user_pass = "Password is required";
    } else if (formData.user_pass.length < 8) {
      newErrors.user_pass = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.user_pass)
    ) {
      newErrors.user_pass =
        "Password must contain uppercase, lowercase, number and special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.user_pass !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await registerMutation.mutateAsync({
        user_nicename: formData.user_nicename,
        user_email: formData.user_email,
        user_pass: formData.user_pass,
      });

      toast.success("Account created successfully!");

      // Get user role from response and redirect accordingly
      const userRole = response.data.user.role;
      if (userRole === "admin") {
        localStorage.setItem("admin-authenticated", "true");
        localStorage.setItem("adminEmail", response.data.user.user_email);
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-primary/5 border-primary/20 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-primary">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-gray-700">
              Join GuestPostNow and start your guest posting journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user_nicename" className="text-gray-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-4 h-4" />
                  <Input
                    id="user_nicename"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.user_nicename}
                    onChange={(e) =>
                      handleInputChange("user_nicename", e.target.value)
                    }
                    className="pl-10 bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                    disabled={registerMutation.isPending}
                  />
                </div>
                {errors.user_nicename && (
                  <p className="text-red-500 text-sm">{errors.user_nicename}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_email" className="text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-4 h-4" />
                  <Input
                    id="user_email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.user_email}
                    onChange={(e) =>
                      handleInputChange("user_email", e.target.value)
                    }
                    className="pl-10 bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                    disabled={registerMutation.isPending}
                  />
                </div>
                {errors.user_email && (
                  <p className="text-red-500 text-sm">{errors.user_email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_pass" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-4 h-4" />
                  <Input
                    id="user_pass"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min 8 chars, uppercase, lowercase, number, special char)"
                    value={formData.user_pass}
                    onChange={(e) =>
                      handleInputChange("user_pass", e.target.value)
                    }
                    className="pl-10 pr-10 bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                    disabled={registerMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-primary"
                    disabled={registerMutation.isPending}>
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.user_pass && (
                  <p className="text-red-500 text-sm">{errors.user_pass}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="pl-10 pr-10 bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                    disabled={registerMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-gray-800"
                    disabled={registerMutation.isPending}>
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                disabled={registerMutation.isPending}>
                {registerMutation.isPending
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-700">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-400 hover:text-blue-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
