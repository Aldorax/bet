"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useBetting } from "@/contexts/betting-context";
import { useAuth } from "@/contexts/auth-context";
import { useNotifications } from "@/contexts/notification-context";
import { Ticket, X, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function BetSlipDrawer() {
  const {
    betSlip,
    betAmount,
    setBetAmount,
    removeFromBetSlip,
    clearBetSlip,
    totalOdds,
    potentialWinnings,
    placeBet,
  } = useBetting();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  const handlePlaceBet = async () => {
    if (!user) {
      toast("Login Required");
      return;
    }

    if (betSlip.length === 0) {
      toast("Empty Bet Slip");
      return;
    }

    if (betAmount <= 0) {
      toast("Invalid Amount");
      return;
    }

    if (user.balance < betAmount) {
      toast("Insufficient Balance");
      return;
    }

    setIsPlacingBet(true);
    try {
      const success = await placeBet();
      if (success) {
        toast("Bet Placed Successfully");
        addNotification({
          message: `Your bet of $${betAmount.toFixed(
            2
          )} has been placed successfully`,
          type: "success",
        });
        setIsOpen(false);
      } else {
        toast("Failed to Place Bet");
      }
    } catch (error) {
      toast("Error");
    } finally {
      setIsPlacingBet(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Ticket className="h-5 w-5" />
          {betSlip.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {betSlip.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Bet Slip ({betSlip.length})</SheetTitle>
          {betSlip.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearBetSlip}
              className="h-8 w-8"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4">
          {betSlip.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Ticket className="h-12 w-12 mb-2" />
              <p>Your bet slip is empty</p>
              <p className="text-sm">Add selections to place a bet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {betSlip.map((selection) => (
                <div
                  key={selection.id}
                  className="bg-muted/50 rounded-lg p-3 relative"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromBetSlip(selection.id)}
                    className="h-6 w-6 absolute top-2 right-2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="pr-6">
                    <div className="font-medium">
                      {selection.homeTeam} vs {selection.awayTeam}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selection.type === "home"
                        ? selection.homeTeam
                        : selection.type === "away"
                        ? selection.awayTeam
                        : "Draw"}{" "}
                      to win
                    </div>
                    <div className="mt-1 inline-block px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                      {selection.odds.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Bet Amount</label>
              <Input
                type="number"
                min="1"
                value={betAmount}
                onChange={(e) =>
                  setBetAmount(Number.parseFloat(e.target.value) || 0)
                }
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Total Odds</label>
              <div className="h-9 px-3 py-1 rounded-md border bg-muted/50 flex items-center">
                {totalOdds.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Potential Winnings:</span>
              <span className="font-medium">
                ${potentialWinnings.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            className="w-full"
            disabled={betSlip.length === 0 || betAmount <= 0 || isPlacingBet}
            onClick={handlePlaceBet}
          >
            {isPlacingBet ? "Placing Bet..." : "Place Bet"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
