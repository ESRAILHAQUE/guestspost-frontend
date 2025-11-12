"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, User2, X } from "lucide-react";
import { useCurrentUser } from "@/hooks/api/useUsers";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Use React Query hook instead of manual fetch
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userLoggedIn = localStorage.getItem("isLoggedIn");
      const role = localStorage.getItem("userRole");
      if (userLoggedIn === "true") {
        setIsLoggedIn(true);
        setUserRole(role);
      }
    }
  }, []);

  // Determine dashboard URL based on user role
  const getDashboardUrl = () => {
    if (userRole === "admin") {
      return "/admin";
    }
    return "/dashboard";
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm z-50 relative">
        <div className="container mx-auto md:px-4 px-2 py-0 ">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-auto h-auto">
                <Image
                  src={"./images/logo.png"}
                  alt="logo"
                  width={90}
                  height={60}
                />
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/catalog"
                className="text-gray-300 hover:text-white transition-colors">
                Catalog
              </Link>
              <Link
                href="/services"
                className="text-gray-300 hover:text-white transition-colors">
                Services
              </Link>
              <Link
                href="/guest-post-package"
                className="text-gray-300 hover:text-white transition-colors">
                Guest Post Package
              </Link>
              <Link
                href="/blog"
                className="text-gray-300 hover:text-white transition-colors">
                Blog
              </Link>
              <Link
                href="/publisher"
                className="text-gray-300 hover:text-white transition-colors">
                Publisher
              </Link>
            </nav>

            {isLoggedIn && user ? (
              <div className="flex items-center space-x-3">
                <Button
                  className="md:flex hidden bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white items-center gap-2"
                  asChild>
                  <Link href={getDashboardUrl()}>
                    <User2 size={18} />
                    {userRole === "admin" ? "Admin Panel" : "Dashboard"}
                  </Link>
                </Button>
                <div
                  onClick={() => setIsMenuOpen(true)}
                  className="menu-icon md:hidden flex text-white">
                  <Menu />
                </div>
              </div>
            ) : (
              <div className="flex items-center md:space-x-3">
                <Button
                  className="md:block hidden bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <div
                  onClick={() => setIsMenuOpen(true)}
                  className="menu-icon md:hidden flex text-white">
                  <Menu />
                </div>
              </div>
            )}

            <div
              className={`${
                isMenuOpen ? "block" : "hidden"
              } transition-transform w-60 md:hidden z-50 rounded-bl-2xl rounded-tl-2xl fixed right-0 flex flex-col gap-6 top-0 h-screen border-b border-white/10 shadow-lg shadow-gray-600  bg-blue-950 px-4 py-6`}>
              <X
                className="text-white w-30"
                onClick={() => setIsMenuOpen(false)}
              />
              <nav className="flex flex-col justify-between h-full gap-3">
                <div className="flex flex-col gap-3">
                  <Link
                    href="/catalog"
                    className="text-gray-300 hover:text-white transition-colors">
                    Catalog
                  </Link>
                  <Link
                    href="/services"
                    className="text-gray-300 hover:text-white transition-colors">
                    Services
                  </Link>
                  <Link
                    href="/guest-post-package"
                    className="text-gray-300 hover:text-white transition-colors">
                    Guest Post Package
                  </Link>
                  <Link
                    href="/blog"
                    className="text-gray-300 hover:text-white transition-colors">
                    Blog
                  </Link>
                  <Link
                    href="/publisher"
                    className="text-gray-300 hover:text-white transition-colors">
                    Publisher
                  </Link>
                </div>
                {isLoggedIn && user ? (
                  <div className="flex items-center space-x-3">
                    <Button
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white w-full flex items-center gap-2 justify-center"
                      asChild>
                      <Link href={getDashboardUrl()}>
                        <User2 size={18} />
                        {userRole === "admin" ? "Admin Panel" : "Dashboard"}
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-y-3 flex-col">
                    <Button
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                      asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
