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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ balance: user.balance });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching balance" },
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
    const { amount, type } = await request.json();

    if (!amount || !type || !["deposit", "withdrawal"].includes(type)) {
      return NextResponse.json(
        { error: "Valid amount and type (deposit/withdrawal) are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // For withdrawals, check if user has enough balance
    if (type === "withdrawal" && user.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Update balance and create transaction in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update balance
      const newBalance =
        type === "deposit" ? user.balance + amount : user.balance - amount;

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: newBalance },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          id: uuidv4(),
          userId,
          amount: type === "deposit" ? amount : -amount,
          type,
          description: `${
            type === "deposit" ? "Deposit" : "Withdrawal"
          } of $${amount}`,
        },
      });

      return { updatedUser, transaction };
    });

    return NextResponse.json({
      success: true,
      newBalance: result.updatedUser.balance,
    });
  } catch (error) {
    console.error("Error updating balance:", error);
    return NextResponse.json(
      { error: "An error occurred while updating balance" },
      { status: 500 }
    );
  }
}
