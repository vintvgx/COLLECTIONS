export const redis = require("redis");

const client = redis.createClient({
  url: "rediss://default:687872dc948b44b2a5618616714a6d72@informed-toad-37492.upstash.io:37492",
});

client.on("connect", () => {
  console.log("Redis client connected");
});

client.on("error", (err: any) => {
  console.log(`Error connecting to REDIS db ${err}`);
});

module.exports = client;
