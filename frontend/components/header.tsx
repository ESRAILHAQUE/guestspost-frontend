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

  // Use React Query hook instead of manual fetch
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isLoggedIn");
    if (userLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

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
              <div className="flex items-center space-x-3 pr-10">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 rounded-full justify-center items-center px-3 md:flex hidden"
                  asChild>
                  <Link href="/dashboard" className="bg-black/20 text-white">
                    <User2 size={50} className="w-20" />
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
                  variant="ghost"
                  className="md:block hidden text-white hover:bg-white/10"
                  asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  className="md:block hidden bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  asChild>
                  <Link href="/signup">Sign Up</Link>
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
                  <div className="flex items-center space-x-3 pr-10">
                    <Button
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                      asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-y-3 flex-col">
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/10 bg-white/20"
                      asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                      asChild>
                      <Link href="/signup">Sign Up</Link>
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
