import { redis } from "../libs/redis";

export const cacheData = (key: any, data: any) => {
  return new Promise((resolve, reject) => {
    redis.set(
      key,
      JSON.stringify(data),
      "EX",
      60 * 60,
      (err: any, reply: unknown) => {
        if (err) {
          console.log("Error caching data:", err);
          return reject(err);
        }
        return resolve(reply);
      }
    );
  });
};

export const getCachedData = (key: any) => {
  return new Promise((resolve, reject) => {
    redis.get(key, (err: any, reply: string) => {
      if (err) {
        console.log("Error retrieving cached data:", err);
        return reject(err);
      }
      return resolve(reply ? JSON.parse(reply) : null);
    });
  });
};
