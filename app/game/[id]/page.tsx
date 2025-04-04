import { Suspense } from "react";
import { GameDetails } from "@/components/game-details";
import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";

export default async function GamePage({ params }: { params: { id: string } }) {
  // This is a server component, so we can fetch the game data here
  const gameId = params.id;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <Suspense fallback={<GameSkeleton />}>
          <GameDetails gameId={gameId} />
        </Suspense>
      </main>
    </div>
  );
}

function GameSkeleton() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center">
        <Skeleton className="h-10 w-10 rounded-full mr-2" />
        <Skeleton className="h-6 w-32" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg mt-6" />
        </div>
        <div>
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg mt-6" />
        </div>
      </div>
    </div>
  );
}
