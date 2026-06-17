import fastifyEnv from "@fastify/env";
import { type Static, Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

export const EnvSchema = Type.Object({
	NODE_ENV: Type.String({ default: "development" }),
	PORT: Type.Integer({ default: 3000 }),
	HOST: Type.String({ default: "0.0.0.0" }),
	DATABASE_URL: Type.String(),
	CORS_ORIGINS: Type.String({ default: "http://localhost:3000" }),
	GATEWAY_BASE_URL: Type.Optional(Type.String()),
});

export type EnvConfig = Static<typeof EnvSchema>;

declare module "fastify" {
	interface FastifyInstance {
		config: EnvConfig;
	}
}

const envPlugin: FastifyPluginAsync = async (fastify) => {
	await fastify.register(fastifyEnv, {
		schema: EnvSchema,
		dotenv: true,
	});
};

export default fp(envPlugin, {
	name: "env",
	fastify: "5.x",
});
