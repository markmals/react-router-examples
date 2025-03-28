import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"

export const Contact = sqliteTable("contacts", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    createdAt: text("createdAt").notNull().default(sql`CURRENT_TIMESTAMP`),
    first: text("first").notNull(),
    last: text("last").notNull(),
    avatar: text("avatar").notNull(),
    bsky: text("bsky").notNull().unique(),
    notes: text("notes"),
    favorite: integer("favorite", { mode: "boolean" }).notNull().default(false),
})

const client = new Database(process.env.DATABASE_URL)
export const db = drizzle(client, { schema: { contacts: Contact } })

// import { exec } from "node:child_process";
// import { promisify } from "node:util";
// const $ = promisify(exec);

// if (import.meta.env.PROD) {
//     // Each time we deploy, we run the database migrations
//     await $("npm run db:migrate");
// }
