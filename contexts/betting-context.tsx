"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useAuth } from "./auth-context";

type Selection = {
  id: string;
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  type: "home" | "draw" | "away";
  odds: number;
};

type BettingContextType = {
  betSlip: Selection[];
  betAmount: number;
  addToBetSlip: (selection: Selection) => void;
  removeFromBetSlip: (id: string) => void;
  clearBetSlip: () => void;
  setBetAmount: (amount: number) => void;
  placeBet: () => Promise<boolean>;
  totalOdds: number;
  potentialWinnings: number;
};

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export function BettingProvider({ children }: { children: ReactNode }) {
  const [betSlip, setBetSlip] = useState<Selection[]>([]);
  const [betAmount, setBetAmount] = useState<number>(10);
  const { updateBalance } = useAuth();

  const addToBetSlip = (selection: Selection) => {
    // Check if we already have a selection for this game
    const existingIndex = betSlip.findIndex(
      (item) => item.gameId === selection.gameId
    );

    if (existingIndex !== -1) {
      // Replace the existing selection
      const newBetSlip = [...betSlip];
      newBetSlip[existingIndex] = selection;
      setBetSlip(newBetSlip);
    } else {
      // Add new selection
      setBetSlip([...betSlip, selection]);
    }
  };

  const removeFromBetSlip = (id: string) => {
    setBetSlip(betSlip.filter((item) => item.id !== id));
  };

  const clearBetSlip = () => {
    setBetSlip([]);
  };

  const totalOdds = betSlip.reduce((acc, item) => acc * item.odds, 1);
  const potentialWinnings = betAmount * totalOdds;

  const placeBet = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/bets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: betAmount,
          selections: betSlip.map((selection) => ({
            gameId: selection.gameId,
            type: selection.type,
            odds: selection.odds,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to place bet");
      }

      const data = await response.json();
      updateBalance(data.newBalance);
      clearBetSlip();
      return true;
    } catch (error) {
      console.error("Error placing bet:", error);
      return false;
    }
  };

  return (
    <BettingContext.Provider
      value={{
        betSlip,
        betAmount,
        addToBetSlip,
        removeFromBetSlip,
        clearBetSlip,
        setBetAmount,
        placeBet,
        totalOdds,
        potentialWinnings,
      }}
    >
      {children}
    </BettingContext.Provider>
  );
}

export function useBetting() {
  const context = useContext(BettingContext);
  if (context === undefined) {
    throw new Error("useBetting must be used within a BettingProvider");
  }
  return context;
}
