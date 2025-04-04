import { Header } from "@/components/header";
import { SportFilter } from "@/components/sport-filter";
import { GameCard } from "@/components/game-card";
import { prisma } from "@/lib/prisma";

export default async function LivePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sportId = searchParams.sportId as string | undefined;

  // Fetch sports
  const allSports = await prisma.sport.findMany({
    where: { isActive: true },
  });

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Live Games</h1>
          <p className="text-muted-foreground mb-6">
            Watch and bet on games happening right now
          </p>

          <SportFilter sports={allSports} />
        </div>

        {liveGames.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No live games at the moment</p>
            <p className="text-sm">Check back later for live games</p>
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
}
