/* eslint-disable react-hooks/immutability */
"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Member Directory", href: "/member-directory" },
    { label: "Membership", href: "/membership" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => setActiveHash(window.location.hash);
    setActiveHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  const isActive = (href: string) =>
    href.startsWith("#") ? activeHash === href : pathname === href;

  const handleNavigation = (path: string) => {
    if (path.startsWith("#")) {
      const el = document.querySelector(path);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      window.location.hash = path;
    } else {
      router.push(path);
    }
    setSidebarOpen(false);
  };

  return (
    <div className="bg-linear-to-b from-[#dff98d] mb-6 to-[#f1fdcb]">
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#dff98d]/80 backdrop-blur-md border-b shadow-sm"
            : "bg-[#f1fdcb]/70 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex items-center justify-between py-3 px-4 lg:px-6 max-w-7xl">
          <div className="hidden lg:flex items-center gap-32 bg-white rounded-4xl py-2 px-16">
            <div className="shrink-0 transition-transform duration-200 hover:scale-105">
              <Link href="/">
                <Image
                  src="/bpc_logo.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="object-contain rounded-2xl"
                />
              </Link>
            </div>
            <div>
              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavigation(item.href)}
                  className={`py-3 px-5 rounded-full transition-all duration-200 active:scale-95 ${
                    isActive(item.href)
                      ? "underline underline-offset-6 decoration-2 text-black"
                      : "hover:bg-gray-100"
                  }`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="hidden lg:block">
              <Button variant="default" className="gap-2 py-6">
                Become a Member
              </Button>
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95"
              aria-label="Open mobile menu"
            >
              <Menu size={20} className="text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      <div className="h-16" />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 sm:w-80 bg-[#f6f1e5]/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col justify-between`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/50">
          <Image
            src="/bpc_logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="object-contain"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95"
            aria-label="Close mobile menu"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-6 py-6 space-y-4 overflow-y-auto">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigation(item.href)}
              className={`w-full text-left py-4 px-5 rounded-2xl text-lg font-medium transition-all duration-200 active:scale-95 border ${
                isActive(item.href)
                  ? "bg-[#d99b35] text-white border-[#d99b35]"
                  : "hover:bg-gray-100 border-[#FFDFAA]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="px-6 pb-8 pt-4 border-t border-gray-200/50">
          <Button
            variant="default"
            className="w-full gap-2 py-5 bg-[#d99b35] hover:bg-[#c7871f] text-lg font-semibold"
          >
            Become a Member
          </Button>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
