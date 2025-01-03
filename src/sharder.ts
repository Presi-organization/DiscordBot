import { ShardingManager } from "discord.js";
import express, { Express } from 'express';
import dotenv from "dotenv";
import healthRoute from "@routes/health";

import config from "@config";

dotenv.config();

const validateEnv = () => {
    const requiredEnvVars = ['MONGO_URI', 'DISCORD_TOKEN', 'AISPEECH_TOKEN', 'CLIENT_ID', 'GUILD_ID', 'WEBHOOK_ID', 'WEBOOK_TOKEN', 'RIOT_TOKEN', 'SHARDS', 'NODE_ENV'];
    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            console.error(`Missing required environment variable: ${ envVar }`);
            process.exit(1);
        }
    });
};
validateEnv();

const app: Express = express();

const port = process.env.PORT || 3000;

const manager = new ShardingManager("./src/bot.js", {
    token: config.token,
    shardArgs: process.argv,
    totalShards: config.shards ?? "auto",
});

app.use("/", healthRoute);

console.log("[Shards] Starting spawn...");

manager.spawn({ timeout: -1 }).then((): void => {
    app.listen(port, (): void => {
        console.log(`[Express] Bot app listening on port ${ port }`)
    });
});
