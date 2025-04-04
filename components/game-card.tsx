"use client";

import type React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBetting } from "@/contexts/betting-context";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { Star } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type GameCardProps = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  startTime: string;
  status: string;
  isLive: boolean;
  odds: {
    homeWin: number;
    draw: number | null;
    awayWin: number;
  } | null;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
};

export function GameCard({
  id,
  homeTeam,
  awayTeam,
  homeScore = 0,
  awayScore = 0,
  startTime,
  status,
  isLive,
  odds,
  isFavorite = false,
  onToggleFavorite,
}: GameCardProps) {
  const { betSlip, addToBetSlip } = useBetting();
  const [favorite, setFavorite] = useState(isFavorite);
  const router = useRouter();

  const handleSelectOdds = (type: "home" | "draw" | "away", odds: number) => {
    addToBetSlip({
      id: uuidv4(),
      gameId: id,
      homeTeam,
      awayTeam,
      type,
      odds,
    });
  };

  const isSelected = (type: "home" | "draw" | "away") => {
    return betSlip.some(
      (selection) => selection.gameId === id && selection.type === type
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(!favorite);
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  const handleCardClick = () => {
    router.push(`/game/${id}`);
  };

  return (
    <Card
      className={cn(
        isLive && "border-primary/50",
        "cursor-pointer hover:shadow-md transition-shadow"
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <div className="text-sm font-medium">
            {homeTeam} vs {awayTeam}
          </div>
          <div className="text-xs text-muted-foreground">
            {isLive ? (
              <span className="text-primary font-medium flex items-center">
                <span className="h-2 w-2 rounded-full bg-primary mr-1 animate-pulse" />
                LIVE
              </span>
            ) : status === "upcoming" ? (
              formatTime(startTime)
            ) : (
              "Finished"
            )}
          </div>
        </div>
        <div className="flex items-center">
          {isLive && (
            <div className="text-lg font-bold mr-2">
              {homeScore} - {awayScore}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleFavorite}
          >
            <Star
              className={cn("h-4 w-4", favorite && "fill-primary text-primary")}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {odds && (
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex flex-col h-auto py-2",
                isSelected("home") && "border-primary bg-primary/10"
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectOdds("home", odds.homeWin);
              }}
              disabled={status === "finished"}
            >
              <span className="text-xs">{homeTeam}</span>
              <span className="font-bold">{odds.homeWin.toFixed(2)}</span>
            </Button>

            {odds.draw !== null ? (
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex flex-col h-auto py-2",
                  isSelected("draw") && "border-primary bg-primary/10"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectOdds("draw", Number(odds.draw));
                }}
                disabled={status === "finished"}
              >
                <span className="text-xs">Draw</span>
                <span className="font-bold">{odds.draw.toFixed(2)}</span>
              </Button>
            ) : (
              <div />
            )}

            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex flex-col h-auto py-2",
                isSelected("away") && "border-primary bg-primary/10"
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectOdds("away", odds.awayWin);
              }}
              disabled={status === "finished"}
            >
              <span className="text-xs">{awayTeam}</span>
              <span className="font-bold">{odds.awayWin.toFixed(2)}</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
