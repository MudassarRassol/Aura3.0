"use client";
import React from "react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  // Agar URL /page/therapy hai to footer na dikhaye
  if (pathname === "/page/therapy") {
    return null;
  }

  return (
    <footer className="border-t border-primary dark:border-primary/80 py-6 w-full">
      <div className="flex flex-col items-center gap-4 px-4 md:px-5">
        <p className="text-md text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} Aura3.0 All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
