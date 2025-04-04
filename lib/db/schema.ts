import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  balance: real("balance").notNull().default(1000), // Default $1000 in simulated funds
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const sports = sqliteTable("sports", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export const games = sqliteTable("games", {
  id: text("id").primaryKey(),
  sportId: text("sport_id")
    .notNull()
    .references(() => sports.id),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  homeScore: integer("home_score").default(0),
  awayScore: integer("away_score").default(0),
  startTime: text("start_time").notNull(),
  status: text("status").notNull().default("upcoming"), // upcoming, live, finished
  isLive: integer("is_live", { mode: "boolean" }).notNull().default(false),
});

export const odds = sqliteTable("odds", {
  id: text("id").primaryKey(),
  gameId: text("game_id")
    .notNull()
    .references(() => games.id),
  homeWin: real("home_win").notNull(),
  draw: real("draw"),
  awayWin: real("away_win").notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const bets = sqliteTable("bets", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  amount: real("amount").notNull(),
  potentialWinnings: real("potential_winnings").notNull(),
  status: text("status").notNull().default("pending"), // pending, won, lost
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const betSelections = sqliteTable("bet_selections", {
  id: text("id").primaryKey(),
  betId: text("bet_id")
    .notNull()
    .references(() => bets.id),
  gameId: text("game_id")
    .notNull()
    .references(() => games.id),
  selection: text("selection").notNull(), // home, draw, away
  odds: real("odds").notNull(),
  status: text("status").notNull().default("pending"), // pending, won, lost
});

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  amount: real("amount").notNull(),
  type: text("type").notNull(), // deposit, withdrawal, bet, win
  description: text("description").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  message: text("message").notNull(),
  type: text("type").notNull(), // info, success, warning, error
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
