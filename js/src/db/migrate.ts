import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error("Missing required environment variable: DATABASE_URL");
}

const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle(pool);

async function runMigrations(): Promise<void> {
	process.stdout.write("Running migrations...\n");
	await migrate(db, { migrationsFolder: "./drizzle/migrations" });
	process.stdout.write("Migrations complete.\n");
	await pool.end();
}

runMigrations().catch((err) => {
	process.stderr.write(`Migration failed: ${String(err)}\n`);
	process.exit(1);
});
