"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

type BetSelection = {
  id: string;
  betId: string;
  gameId: string;
  selection: string;
  odds: number;
  status: string;
};

type Bet = {
  id: string;
  userId: string;
  amount: number;
  potentialWinnings: number;
  status: string;
  createdAt: string;
  selections: BetSelection[];
};

export default function MyBetsPage() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function fetchBets() {
      try {
        const response = await fetch("/api/bets");
        if (response.ok) {
          const data = await response.json();
          setBets(data);
        }
      } catch (error) {
        console.error("Error fetching bets:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBets();
  }, [user, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "bg-green-500 hover:bg-green-600";
      case "lost":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-yellow-500 hover:bg-yellow-600";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <h1 className="text-3xl font-bold mb-6">My Bets</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : bets.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>You haven&apos;t placed any bets yet</p>
            <p className="text-sm">Place a bet to see it here</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bets.map((bet) => (
              <Card key={bet.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      Bet #{bet.id.substring(0, 8)}
                    </CardTitle>
                    <Badge className={getStatusColor(bet.status)}>
                      {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Placed{" "}
                    {formatDistanceToNow(new Date(bet.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      {bet.selections.map((selection) => (
                        <div
                          key={selection.id}
                          className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <div className="font-medium">
                              {selection.selection.charAt(0).toUpperCase() +
                                selection.selection.slice(1)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Odds: {selection.odds.toFixed(2)}
                            </div>
                          </div>
                          {selection.status !== "pending" && (
                            <Badge
                              className={
                                selection.status === "won"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }
                            >
                              {selection.status.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Stake
                        </div>
                        <div className="font-medium">
                          ${bet.amount.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          Potential Winnings
                        </div>
                        <div className="font-medium">
                          ${bet.potentialWinnings.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
