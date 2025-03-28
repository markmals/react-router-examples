import { defineConfig } from "drizzle-kit"
import invariant from "tiny-invariant"

invariant(process.env.DATABASE_URL, "Must define DATABASE_URL in .env file")

export default defineConfig({
    out: "./app/drizzle",
    schema: "./app/lib/db.ts",
    dialect: "sqlite",
    dbCredentials: { url: process.env.DATABASE_URL },
})
