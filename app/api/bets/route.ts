import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get("session");
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(sessionCookie.value);

    const userBets = await prisma.bet.findMany({
      where: { userId },
      include: {
        selections: true,
      },
    });

    return NextResponse.json(userBets);
  } catch (error) {
    console.error("Error fetching bets:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching bets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const sessionCookie = (await cookies()).get("session");
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(sessionCookie.value);
    const { amount, selections } = await request.json();

    if (!amount || !selections || !selections.length) {
      return NextResponse.json(
        { error: "Amount and selections are required" },
        { status: 400 }
      );
    }

    // Check if user has enough balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Calculate potential winnings
    let totalOdds = 1;
    for (const selection of selections) {
      totalOdds *= selection.odds;
    }

    const potentialWinnings = amount * totalOdds;

    // Create bet and selections in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create bet
      const bet = await tx.bet.create({
        data: {
          id: uuidv4(),
          userId,
          amount,
          potentialWinnings,
          status: "pending",
          selections: {
            create: selections.map((selection: any) => ({
              id: uuidv4(),
              gameId: selection.gameId,
              selection: selection.type, // home, draw, away
              odds: selection.odds,
              status: "pending",
            })),
          },
        },
      });

      // Update user balance
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: user.balance - amount },
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          id: uuidv4(),
          userId,
          amount: -amount,
          type: "bet",
          description: `Bet placed with ${selections.length} selections`,
        },
      });

      return { bet, updatedUser };
    });

    return NextResponse.json({
      success: true,
      betId: result.bet.id,
      newBalance: result.updatedUser.balance,
    });
  } catch (error) {
    console.error("Error placing bet:", error);
    return NextResponse.json(
      { error: "An error occurred while placing bet" },
      { status: 500 }
    );
  }
}
