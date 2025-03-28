import { defineConfig } from "vite";

import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { bootstrapDatabase } from "./db-bootstrap.plugin";

export default defineConfig({
    plugins: [reactRouter(), tsconfigPaths(), bootstrapDatabase()],
});
