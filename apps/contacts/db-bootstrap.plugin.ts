import type { Plugin } from "vite";

import invariant from "tiny-invariant";
import fs from "node:fs/promises";
import { exec } from "node:child_process";
import { promisify } from "node:util";
const $ = promisify(exec);

// Every time the development server starts up, the database is blown away
// and recreated with the correct table structure
export function bootstrapDatabase(): Plugin {
    return {
        name: "bootstrap-database",
        async configureServer() {
            invariant(process.env.DATABASE_URL, "Must define DATABASE_URL in .env file");

            try {
                // Remove existing database file if it exists
                await fs.unlink(process.env.DATABASE_URL).catch(() => {});

                // Create new empty database file
                await fs.writeFile(process.env.DATABASE_URL, "");

                // Create necessary tables using drizzle-kit push
                const { stdout } = await $("npx drizzle-kit push");

                console.log("Database bootstrapped successfully\n");
                // console.log(stdout, "\n");
            } catch (error) {
                console.error("Error bootstrapping database:", error);
                process.exit(1);
            }
        },
    };
}
