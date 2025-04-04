import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const allSports = await prisma.sport.findMany({
      where: { isActive: true },
    });
    return NextResponse.json(allSports);
  } catch (error) {
    console.error("Error fetching sports:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching sports" },
      { status: 500 }
    );
  }
}
