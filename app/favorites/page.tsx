"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { GameCard } from "@/components/game-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

type Game = {
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
};

export default function FavoritesPage() {
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Simulate fetching favorite games
    const fetchFavorites = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data for favorites
        const mockFavorites: Game[] = [
          {
            id: "1",
            homeTeam: "Arsenal",
            awayTeam: "Chelsea",
            homeScore: 2,
            awayScore: 1,
            startTime: new Date().toISOString(),
            status: "live",
            isLive: true,
            odds: {
              homeWin: 1.85,
              draw: 3.5,
              awayWin: 4.2,
            },
          },
          {
            id: "2",
            homeTeam: "Lakers",
            awayTeam: "Warriors",
            startTime: new Date(Date.now() + 3600000).toISOString(),
            status: "upcoming",
            isLive: false,
            odds: {
              homeWin: 2.1,
              draw: null,
              awayWin: 1.75,
            },
          },
        ];

        setFavoriteGames(mockFavorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user, router]);

  const removeFavorite = (id: string) => {
    setFavoriteGames((prev) => prev.filter((game) => game.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <h1 className="text-3xl font-bold mb-6">Favorite Games</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : favoriteGames.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium">No favorite games yet</p>
            <p className="text-sm mb-6">
              Add games to your favorites to see them here
            </p>
            <Button onClick={() => router.push("/")}>Browse Games</Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favoriteGames.map((game) => (
              <div key={game.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 h-8 w-8 bg-background/80 hover:bg-background"
                  onClick={() => removeFavorite(game.id)}
                >
                  <Star className="h-4 w-4 fill-primary text-primary" />
                </Button>
                <GameCard
                  id={game.id}
                  homeTeam={game.homeTeam}
                  awayTeam={game.awayTeam}
                  homeScore={game.homeScore}
                  awayScore={game.awayScore}
                  startTime={game.startTime}
                  status={game.status}
                  isLive={game.isLive}
                  odds={game.odds}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
