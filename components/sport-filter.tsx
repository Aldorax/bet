"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ClubIcon as Football,
  ShoppingBasketIcon as Basketball,
  TurtleIcon as Tennis,
  HopIcon as Hockey,
  BeerIcon as Baseball,
  type LucideIcon,
} from "lucide-react";

type Sport = {
  id: string;
  name: string;
  icon: string;
};

const sportIcons: Record<string, LucideIcon> = {
  football: Football,
  basketball: Basketball,
  tennis: Tennis,
  hockey: Hockey,
  baseball: Baseball,
};

type SportFilterProps = {
  sports: Sport[];
};

export function SportFilter({ sports }: SportFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSportId = searchParams.get("sportId") || "all";

  const handleSportChange = (sportId: string) => {
    const params = new URLSearchParams(searchParams);
    if (sportId === "all") {
      params.delete("sportId");
    } else {
      params.set("sportId", sportId);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 p-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center space-x-2 rounded-lg px-3",
            selectedSportId === "all" && "bg-muted font-medium"
          )}
          onClick={() => handleSportChange("all")}
        >
          <span>All Sports</span>
        </Button>

        {sports.map((sport) => {
          const Icon = sportIcons[sport.icon] || Football;
          return (
            <Button
              key={sport.id}
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center space-x-2 rounded-lg px-3",
                selectedSportId === sport.id && "bg-muted font-medium"
              )}
              onClick={() => handleSportChange(sport.id)}
            >
              <Icon className="h-4 w-4" />
              <span>{sport.name}</span>
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
