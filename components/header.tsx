"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { BetSlipDrawer } from "@/components/bet-slip-drawer";
import { NotificationDrawer } from "@/components/notification-drawer";
import { useAuth } from "@/contexts/auth-context";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-background transition-shadow ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="font-bold text-xl mr-6">
            BetSim
          </Link>
          <MainNav />
        </div>
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <div className="hidden md:flex items-center mr-4 text-sm">
                <Wallet className="h-4 w-4 mr-1" />
                <span className="font-medium">${user.balance.toFixed(2)}</span>
              </div>
              <NotificationDrawer />
              <BetSlipDrawer />
              <UserNav />
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Balance Display */}
      {user && (
        <div className="md:hidden flex justify-center py-2 border-t bg-muted/30">
          <div className="flex items-center text-sm">
            <Wallet className="h-4 w-4 mr-1" />
            <span className="font-medium">
              Balance: ${user.balance.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
