import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Initializing database...");

  // Create demo user
  const passwordHash = await hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      username: "demo_user",
      email: "demo@example.com",
      passwordHash,
      balance: 1000,
    },
  });

  // Add sports
  const sportsData = [
    { name: "Football", icon: "football" },
    { name: "Basketball", icon: "basketball" },
    { name: "Tennis", icon: "tennis" },
    { name: "Hockey", icon: "hockey" },
    { name: "Baseball", icon: "baseball" },
  ];

  for (const sport of sportsData) {
    await prisma.sport.upsert({
      where: { name: sport.name },
      update: { icon: sport.icon },
      create: sport,
    });
  }

  // Get inserted sports
  const insertedSports = await prisma.sport.findMany();

  // Add games for each sport
  for (const sport of insertedSports) {
    // Create 5 games for each sport
    for (let i = 0; i < 5; i++) {
      const now = new Date();
      const startTime = new Date(now.getTime() + i * 3600000); // Each game starts 1 hour after the previous

      const isLive = i === 0; // First game is live
      const status = isLive ? "live" : i < 3 ? "upcoming" : "finished";

      const game = await prisma.game.create({
        data: {
          sportId: sport.id,
          homeTeam: `Home Team ${i + 1}`,
          awayTeam: `Away Team ${i + 1}`,
          homeScore:
            status === "finished"
              ? Math.floor(Math.random() * 5)
              : isLive
              ? Math.floor(Math.random() * 3)
              : 0,
          awayScore:
            status === "finished"
              ? Math.floor(Math.random() * 5)
              : isLive
              ? Math.floor(Math.random() * 3)
              : 0,
          startTime,
          status,
          isLive,
        },
      });

      // Add odds for this game
      await prisma.odds.create({
        data: {
          gameId: game.id,
          homeWin: 1 + Math.random() * 3,
          draw: sport.name !== "Tennis" ? 2 + Math.random() * 3 : null, // Tennis doesn't have draws
          awayWin: 1 + Math.random() * 3,
        },
      });
    }
  }

  console.log("Database initialized successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
