import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get("session");
    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    const { userId } = JSON.parse(sessionCookie.value);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      (await cookies()).delete("session");
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ user: null });
  }
}
