import { db } from "./index";
import { sports, games, odds, users } from "./schema";
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcrypt";

async function seed() {
  console.log("Seeding database...");

  // Create demo user
  const passwordHash = await hash("password123", 10);
  await db
    .insert(users)
    .values({
      id: uuidv4(),
      username: "demo_user",
      email: "demo@example.com",
      passwordHash,
      balance: 1000,
    })
    .onConflictDoNothing();

  // Add sports
  const sportsData = [
    { id: uuidv4(), name: "Football", icon: "football" },
    { id: uuidv4(), name: "Basketball", icon: "basketball" },
    { id: uuidv4(), name: "Tennis", icon: "tennis" },
    { id: uuidv4(), name: "Hockey", icon: "hockey" },
    { id: uuidv4(), name: "Baseball", icon: "baseball" },
  ];

  for (const sport of sportsData) {
    await db.insert(sports).values(sport).onConflictDoNothing();
  }

  // Get inserted sports
  const insertedSports = await db.select().from(sports);

  // Add games for each sport
  for (const sport of insertedSports) {
    const gamesData = [];

    // Create 5 games for each sport
    for (let i = 0; i < 5; i++) {
      const gameId = uuidv4();
      const now = new Date();
      const startTime = new Date(now.getTime() + i * 3600000); // Each game starts 1 hour after the previous

      const isLive = i === 0; // First game is live
      const status = isLive ? "live" : i < 3 ? "upcoming" : "finished";

      gamesData.push({
        id: gameId,
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
        startTime: startTime.toISOString(),
        status,
        isLive,
      });

      // Add odds for this game
      await db
        .insert(odds)
        .values({
          id: uuidv4(),
          gameId,
          homeWin: 1 + Math.random() * 3,
          draw: sport.name !== "Tennis" ? 2 + Math.random() * 3 : null, // Tennis doesn't have draws
          awayWin: 1 + Math.random() * 3,
        })
        .onConflictDoNothing();
    }

    for (const game of gamesData) {
      await db.insert(games).values(game).onConflictDoNothing();
    }
  }

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
