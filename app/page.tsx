import { Header } from "@/components/header";
import { SportFilter } from "@/components/sport-filter";
import { GameCard } from "@/components/game-card";
import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { GamesSkeleton } from "@/components/games-skeleton";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sportId = searchParams.sportId as string | undefined;

  // Fetch sports
  const allSports = await prisma.sport.findMany({
    where: { isActive: true },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Sports Betting</h1>
          <p className="text-muted-foreground mb-6">
            Place bets on your favorite sports and games. This is a simulation
            platform - no real money is involved.
          </p>

          <SportFilter sports={allSports} />
        </div>

        <Tabs defaultValue="live" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="live" className="relative">
              Live
            </TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="finished">Finished</TabsTrigger>
          </TabsList>

          <TabsContent value="live">
            <Suspense fallback={<GamesSkeleton />}>
              <LiveGames sportId={sportId} />
            </Suspense>
          </TabsContent>

          <TabsContent value="upcoming">
            <Suspense fallback={<GamesSkeleton />}>
              <UpcomingGames sportId={sportId} />
            </Suspense>
          </TabsContent>

          <TabsContent value="finished">
            <Suspense fallback={<GamesSkeleton />}>
              <FinishedGames sportId={sportId} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

async function LiveGames({ sportId }: { sportId?: string }) {
  // Fetch live games
  const liveGames = await prisma.game.findMany({
    where: {
      isLive: true,
      ...(sportId ? { sportId } : {}),
    },
    include: {
      odds: true,
    },
  });

  if (liveGames.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No live games at the moment</p>
        <p className="text-sm">Check back later for live games</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {liveGames.map((game) => (
        <GameCard
          key={game.id}
          id={game.id}
          homeTeam={game.homeTeam}
          awayTeam={game.awayTeam}
          homeScore={game.homeScore}
          awayScore={game.awayScore}
          startTime={game.startTime.toISOString()}
          status={game.status}
          isLive={game.isLive}
          odds={
            game.odds
              ? {
                  homeWin: game.odds.homeWin,
                  draw: game.odds.draw,
                  awayWin: game.odds.awayWin,
                }
              : null
          }
        />
      ))}
    </div>
  );
}

async function UpcomingGames({ sportId }: { sportId?: string }) {
  // Fetch upcoming games
  const upcomingGames = await prisma.game.findMany({
    where: {
      status: "upcoming",
      isLive: false,
      ...(sportId ? { sportId } : {}),
    },
    include: {
      odds: true,
    },
  });

  if (upcomingGames.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No upcoming games</p>
        <p className="text-sm">Check back later for upcoming games</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {upcomingGames.map((game) => (
        <GameCard
          key={game.id}
          id={game.id}
          homeTeam={game.homeTeam}
          awayTeam={game.awayTeam}
          startTime={game.startTime.toISOString()}
          status={game.status}
          isLive={game.isLive}
          odds={
            game.odds
              ? {
                  homeWin: game.odds.homeWin,
                  draw: game.odds.draw,
                  awayWin: game.odds.awayWin,
                }
              : null
          }
        />
      ))}
    </div>
  );
}

async function FinishedGames({ sportId }: { sportId?: string }) {
  // Fetch finished games
  const finishedGames = await prisma.game.findMany({
    where: {
      status: "finished",
      ...(sportId ? { sportId } : {}),
    },
    include: {
      odds: true,
    },
  });

  if (finishedGames.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No finished games</p>
        <p className="text-sm">Check back later for finished games</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {finishedGames.map((game) => (
        <GameCard
          key={game.id}
          id={game.id}
          homeTeam={game.homeTeam}
          awayTeam={game.awayTeam}
          homeScore={game.homeScore}
          awayScore={game.awayScore}
          startTime={game.startTime.toISOString()}
          status={game.status}
          isLive={game.isLive}
          odds={
            game.odds
              ? {
                  homeWin: game.odds.homeWin,
                  draw: game.odds.draw,
                  awayWin: game.odds.awayWin,
                }
              : null
          }
        />
      ))}
    </div>
  );
}
