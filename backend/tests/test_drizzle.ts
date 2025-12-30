import drizzle_config from '../drizzle.config'

// console.log("drizzle_config:", import.meta.resolve("drizzle_config"));
// xxx may not have a typed dbCredentials property on the Config type; use a safe any cast and optional chaining
console.log("Database file path by drizzle_config:", (drizzle_config as any)?.dbCredentials?.url);