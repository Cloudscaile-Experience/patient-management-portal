import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		env: {
			NODE_ENV: "test",
			DATABASE_URL: "postgresql://test:test@localhost:5432/test_db",
		},
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: ["node_modules", "dist", "drizzle", "vitest.config.ts", "drizzle.config.ts"],
		},
		include: ["src/**/__tests__/**/*.test.ts"],
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("src", import.meta.url)),
		},
	},
});
