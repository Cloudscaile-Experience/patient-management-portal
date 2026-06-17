import authPlugin from "@/hooks/auth.js";
import patientsRoutes from "@/modules/patients/patients.routes.js";
import dbPlugin from "@/plugins/db.js";
import envPlugin from "@/plugins/env.js";
import swaggerPlugin from "@/plugins/swagger.js";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import sensible from "@fastify/sensible";
import Fastify, { type FastifyError, type FastifyInstance } from "fastify";

export async function buildApp(): Promise<FastifyInstance> {
	const fastify = Fastify({
		logger:
			process.env.NODE_ENV === "development"
				? { transport: { target: "pino-pretty", options: { colorize: true } } }
				: true,
		ajv: {
			customOptions: {
				strict: "log",
				keywords: ["kind", "modifier"],
			},
		},
	});

	// 1. Env — must be first so fastify.config is available to all other plugins
	await fastify.register(envPlugin);

	// 2. Security plugins
	await fastify.register(helmet);
	await fastify.register(cors, {
		origin: fastify.config.CORS_ORIGINS.split(","),
		credentials: true,
	});
	await fastify.register(rateLimit, {
		max: 100,
		timeWindow: "1 minute",
	});
	await fastify.register(sensible);

	// 3. Database
	await fastify.register(dbPlugin);

	// 4. API docs
	await fastify.register(swaggerPlugin);

	// 5. Auth decorator (decode-only — gateway validates the signature)
	await fastify.register(authPlugin);

	// Global error handler
	fastify.setErrorHandler((error: FastifyError, request, reply) => {
		request.log.error({ err: error }, "Unhandled error");
		const statusCode = error.statusCode ?? 500;
		reply.status(statusCode).send({
			statusCode,
			error: error.name,
			message: statusCode < 500 ? error.message : "Internal Server Error",
		});
	});

	// Health check — /open/* routes require no auth
	fastify.get(
		"/open/health",
		{
			schema: {
				summary: "Health check",
				description: "Returns service health status.",
				tags: ["health"],
				response: {
					200: {
						type: "object",
						properties: {
							status: { type: "string" },
							timestamp: { type: "string" },
						},
					},
				},
			},
		},
		async (_request, reply) => {
			reply.send({ status: "ok", timestamp: new Date().toISOString() });
		},
	);

	// Feature modules
	await fastify.register(patientsRoutes, { prefix: "/v1/patients" });

	return fastify;
}
