"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, TrendingUp, Calendar, Star, User, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Live",
      href: "/live",
      icon: TrendingUp,
    },
    {
      name: "Upcoming",
      href: "/upcoming",
      icon: Calendar,
    },
    {
      name: "Favorites",
      href: "/favorites",
      icon: Star,
    },
    {
      name: "My Bets",
      href: "/my-bets",
      icon: Ticket,
    },
    {
      name: "Account",
      href: "/account",
      icon: User,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t">
      <div className="grid grid-cols-6">
        {navItems.map((item) => (
          <button
            key={item.href}
            className={cn(
              "flex flex-col items-center justify-center py-2",
              pathname === item.href ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => router.push(item.href)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
