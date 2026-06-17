import * as schema from "@/db/schema/index.js";
import { drizzle } from "drizzle-orm/node-postgres";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { Pool } from "pg";

const dbPlugin: FastifyPluginAsync = async (fastify) => {
	const pool = new Pool({ connectionString: fastify.config.DATABASE_URL });
	const db = drizzle(pool, { schema });

	fastify.decorate("db", db);

	fastify.addHook("onClose", async () => {
		fastify.log.info("Closing database connection pool...");
		await pool.end();
	});
};

export default fp(dbPlugin, {
	name: "db",
	fastify: "5.x",
	dependencies: ["env"],
});
