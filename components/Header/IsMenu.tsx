"use client";
import React from "react";
import { Button } from "../ui/button";
import { MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { navItems } from "./page";

const IsMenu = () => {
  const [isMenu, setIsMenu] = React.useState(false);

  return (
    <>
      {/* Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden z-50"
        onClick={() => setIsMenu(!isMenu)}
      >
        {isMenu ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
      </Button>

      {/* Dropdown */}
      {isMenu && (
        <div className="md:hidden absolute top-[64px] left-0 w-full border-t border-primary/10 bg-background/95 backdrop-blur flex flex-col space-y-1 py-4 ">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mx-2 my-2 p-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-gray-400/20 transition-colors"
              onClick={() => setIsMenu(false)} // close on click
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default IsMenu;
