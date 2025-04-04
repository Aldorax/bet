import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sportId = searchParams.get("sportId");
    const status = searchParams.get("status");

    const games = await prisma.game.findMany({
      where: {
        ...(sportId ? { sportId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        odds: true,
        sport: true,
      },
    });

    // Transform the results to a more usable format
    const formattedGames = games.map((game) => ({
      ...game,
      odds: game.odds
        ? {
            homeWin: game.odds.homeWin,
            draw: game.odds.draw,
            awayWin: game.odds.awayWin,
          }
        : null,
      sport: game.sport
        ? {
            id: game.sport.id,
            name: game.sport.name,
            icon: game.sport.icon,
          }
        : null,
    }));

    return NextResponse.json(formattedGames);
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching games" },
      { status: 500 }
    );
  }
}
