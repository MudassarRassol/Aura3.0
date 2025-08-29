"use client";

import {
  AudioWaveform,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import ThemeToggle from "../ThemeToggle";
import SignInButton from "../auth/Sign-In-button";
import { navItems } from "./page";
import MobileMenu from "./IsMenu";
import { Button } from "../ui/button";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout, setAuthFromStorage } from "@/redux/store/authSlice";
const Header = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  // Sync Redux with localStorage on first load
  useEffect(() => {
    const login = localStorage.getItem("login") === "true";
    dispatch(setAuthFromStorage(login));
  }, [dispatch]);

  const handleLogout = () => {
    axios.post("/api/logout").then(() => {
      localStorage.removeItem("login");
      dispatch(logout())
    });
  };

  return (
    <div className=" select-none w-full fixed top-0 z-50 bg-transparent backdrop-blur-sm">
      <div className="absolute inset-0 border-b-2"></div>
      <header className="px-3 py-2 md:py-0 md:px-10 flex items-center justify-between">
       <Link href="/" >
       <div className="py-3 max-w-7xl w-full">
          <div className="flex items-center gap-2 md:gap-4">
            <AudioWaveform className="w-5 h-5 md:h-10 md:w-10 text-primary cursor-pointer z-50" />
            <Link href="/" className="flex flex-col z-50">
              <span className="text-md md:text-lg font-semibold text-primary">
                Aura3.0
              </span>
              <span className="hidden md:block text-sm text-muted-foreground">
                Your mental health Companion
              </span>
            </Link>
          </div>
        </div>
          </Link>

        {/* navigation */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link href="/page/dashboard" className=" cursor-pointer z-50" >
                  <Button className=" flex items-center  text-black">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  className=" flex items-center  cursor-pointer z-50 text-black"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <SignInButton className="cursor-pointer z-50" />
            )}
            <MobileMenu />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
