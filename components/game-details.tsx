"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBetting } from "@/contexts/betting-context";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Game = {
  id: string;
  sportId: string;
  sportName: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  startTime: string;
  status: string;
  isLive: boolean;
  odds: {
    homeWin: number;
    draw: number | null;
    awayWin: number;
  };
  stats: {
    possession: [number, number];
    shots: [number, number];
    shotsOnTarget: [number, number];
    corners: [number, number];
    fouls: [number, number];
  };
};

export function GameDetails({ gameId }: { gameId: string }) {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { betSlip, addToBetSlip } = useBetting();
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching game details
    const fetchGame = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data for game details
        const mockGame: Game = {
          id: gameId,
          sportId: "1",
          sportName: "Football",
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
          stats: {
            possession: [60, 40],
            shots: [12, 8],
            shotsOnTarget: [5, 3],
            corners: [7, 4],
            fouls: [10, 12],
          },
        };

        setGame(mockGame);
      } catch (error) {
        console.error("Error fetching game:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  const handleSelectOdds = (type: "home" | "draw" | "away", odds: number) => {
    if (!game) return;

    addToBetSlip({
      id: uuidv4(),
      gameId: game.id,
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
      type,
      odds,
    });
  };

  const isSelected = (type: "home" | "draw" | "away") => {
    if (!game) return false;
    return betSlip.some(
      (selection) => selection.gameId === game.id && selection.type === type
    );
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-2">Game Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The game you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{game.sportName}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className={cn(game.isLive && "border-primary/50")}>
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {game.isLive && (
                    <span className="text-primary font-medium flex items-center mr-2">
                      <span className="h-2 w-2 rounded-full bg-primary mr-1 animate-pulse" />
                      LIVE
                    </span>
                  )}
                  {!game.isLive && (
                    <span className="flex items-center text-sm text-muted-foreground mr-2">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatTime(game.startTime)}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFavorite}
                  className="h-8 w-8"
                >
                  <Star
                    className={cn(
                      "h-5 w-5",
                      isFavorite && "fill-primary text-primary"
                    )}
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex justify-between items-center py-4">
                <div className="text-center flex-1">
                  <div className="text-xl font-bold">{game.homeTeam}</div>
                  {game.isLive && (
                    <div className="text-3xl font-bold mt-2">
                      {game.homeScore}
                    </div>
                  )}
                </div>
                <div className="text-center text-muted-foreground mx-4">VS</div>
                <div className="text-center flex-1">
                  <div className="text-xl font-bold">{game.awayTeam}</div>
                  {game.isLive && (
                    <div className="text-3xl font-bold mt-2">
                      {game.awayScore}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col h-auto py-2",
                    isSelected("home") && "border-primary bg-primary/10"
                  )}
                  onClick={() => handleSelectOdds("home", game.odds.homeWin)}
                  disabled={game.status === "finished"}
                >
                  <span className="text-xs">{game.homeTeam}</span>
                  <span className="font-bold">
                    {game.odds.homeWin.toFixed(2)}
                  </span>
                </Button>

                {game.odds.draw !== null ? (
                  <Button
                    variant="outline"
                    className={cn(
                      "flex flex-col h-auto py-2",
                      isSelected("draw") && "border-primary bg-primary/10"
                    )}
                    onClick={() => handleSelectOdds("draw", game.odds.draw!)}
                    disabled={game.status === "finished"}
                  >
                    <span className="text-xs">Draw</span>
                    <span className="font-bold">
                      {game.odds.draw.toFixed(2)}
                    </span>
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col h-auto py-2",
                    isSelected("away") && "border-primary bg-primary/10"
                  )}
                  onClick={() => handleSelectOdds("away", game.odds.awayWin)}
                  disabled={game.status === "finished"}
                >
                  <span className="text-xs">{game.awayTeam}</span>
                  <span className="font-bold">
                    {game.odds.awayWin.toFixed(2)}
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="stats" className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="stats">Match Stats</TabsTrigger>
              <TabsTrigger value="lineups">Lineups</TabsTrigger>
              <TabsTrigger value="h2h">Head to Head</TabsTrigger>
            </TabsList>

            <TabsContent value="stats">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Possession</div>
                      <div className="flex items-center w-2/3">
                        <div
                          className="bg-primary h-2 rounded-l"
                          style={{ width: `${game.stats.possession[0]}%` }}
                        ></div>
                        <div
                          className="bg-muted h-2 rounded-r"
                          style={{ width: `${game.stats.possession[1]}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between w-16 text-sm">
                        <span>{game.stats.possession[0]}%</span>
                        <span>{game.stats.possession[1]}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">Shots</div>
                      <div className="flex items-center w-2/3">
                        <div
                          className="bg-primary h-2 rounded-l"
                          style={{
                            width: `${
                              (game.stats.shots[0] /
                                (game.stats.shots[0] + game.stats.shots[1])) *
                              100
                            }%`,
                          }}
                        ></div>
                        <div
                          className="bg-muted h-2 rounded-r"
                          style={{
                            width: `${
                              (game.stats.shots[1] /
                                (game.stats.shots[0] + game.stats.shots[1])) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between w-16 text-sm">
                        <span>{game.stats.shots[0]}</span>
                        <span>{game.stats.shots[1]}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">Shots on Target</div>
                      <div className="flex items-center w-2/3">
                        <div
                          className="bg-primary h-2 rounded-l"
                          style={{
                            width: `${
                              (game.stats.shotsOnTarget[0] /
                                (game.stats.shotsOnTarget[0] +
                                  game.stats.shotsOnTarget[1])) *
                              100
                            }%`,
                          }}
                        ></div>
                        <div
                          className="bg-muted h-2 rounded-r"
                          style={{
                            width: `${
                              (game.stats.shotsOnTarget[1] /
                                (game.stats.shotsOnTarget[0] +
                                  game.stats.shotsOnTarget[1])) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between w-16 text-sm">
                        <span>{game.stats.shotsOnTarget[0]}</span>
                        <span>{game.stats.shotsOnTarget[1]}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">Corners</div>
                      <div className="flex items-center w-2/3">
                        <div
                          className="bg-primary h-2 rounded-l"
                          style={{
                            width: `${
                              (game.stats.corners[0] /
                                (game.stats.corners[0] +
                                  game.stats.corners[1])) *
                              100
                            }%`,
                          }}
                        ></div>
                        <div
                          className="bg-muted h-2 rounded-r"
                          style={{
                            width: `${
                              (game.stats.corners[1] /
                                (game.stats.corners[0] +
                                  game.stats.corners[1])) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between w-16 text-sm">
                        <span>{game.stats.corners[0]}</span>
                        <span>{game.stats.corners[1]}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">Fouls</div>
                      <div className="flex items-center w-2/3">
                        <div
                          className="bg-primary h-2 rounded-l"
                          style={{
                            width: `${
                              (game.stats.fouls[0] /
                                (game.stats.fouls[0] + game.stats.fouls[1])) *
                              100
                            }%`,
                          }}
                        ></div>
                        <div
                          className="bg-muted h-2 rounded-r"
                          style={{
                            width: `${
                              (game.stats.fouls[1] /
                                (game.stats.fouls[0] + game.stats.fouls[1])) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between w-16 text-sm">
                        <span>{game.stats.fouls[0]}</span>
                        <span>{game.stats.fouls[1]}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lineups">
              <Card>
                <CardContent className="p-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold mb-3">{game.homeTeam}</h3>
                      <div className="space-y-2">
                        {Array.from({ length: 11 }).map((_, i) => (
                          <div key={i} className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              {i + 1}
                            </div>
                            <div>Player {i + 1}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-3">{game.awayTeam}</h3>
                      <div className="space-y-2">
                        {Array.from({ length: 11 }).map((_, i) => (
                          <div key={i} className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                              {i + 1}
                            </div>
                            <div>Player {i + 1}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="h2h">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-4">Previous Meetings</h3>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="text-sm">
                          {new Date(
                            Date.now() - (i + 1) * 30 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>{game.homeTeam}</span>
                          <span className="font-bold">
                            {Math.floor(Math.random() * 4)} -{" "}
                            {Math.floor(Math.random() * 4)}
                          </span>
                          <span>{game.awayTeam}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader className="p-4 pb-2">
              <h3 className="font-bold">More Betting Options</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Total Goals</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-auto py-2">
                      <div className="flex flex-col">
                        <span className="text-xs">Over 2.5</span>
                        <span className="font-bold">1.95</span>
                      </div>
                    </Button>
                    <Button variant="outline" size="sm" className="h-auto py-2">
                      <div className="flex flex-col">
                        <span className="text-xs">Under 2.5</span>
                        <span className="font-bold">1.85</span>
                      </div>
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">
                    Both Teams to Score
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-auto py-2">
                      <div className="flex flex-col">
                        <span className="text-xs">Yes</span>
                        <span className="font-bold">1.75</span>
                      </div>
                    </Button>
                    <Button variant="outline" size="sm" className="h-auto py-2">
                      <div className="flex flex-col">
                        <span className="text-xs">No</span>
                        <span className="font-bold">2.05</span>
                      </div>
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Correct Score</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["1-0", 7.5],
                      ["2-0", 9.0],
                      ["2-1", 8.5],
                      ["0-0", 12.0],
                      ["1-1", 6.5],
                      ["2-2", 15.0],
                      ["0-1", 10.0],
                      ["0-2", 15.0],
                      ["1-2", 10.5],
                    ].map(([score, odds]) => (
                      <Button
                        key={score}
                        variant="outline"
                        size="sm"
                        className="h-auto py-2"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs">{score}</span>
                          <span className="font-bold">{odds}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="p-4 pb-2">
              <h3 className="font-bold">Similar Games</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start h-auto py-3 px-3"
                    onClick={() => router.push(`/game/${i + 10}`)}
                  >
                    <div className="text-left">
                      <div className="flex justify-between w-full">
                        <div>Team A vs Team B</div>
                        {Math.random() > 0.5 && (
                          <span className="text-primary text-xs flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mr-1 animate-pulse" />
                            LIVE
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(
                          Date.now() + (i + 1) * 3600000
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
