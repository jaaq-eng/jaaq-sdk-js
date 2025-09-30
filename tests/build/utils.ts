import * as path from "node:path";
import * as fs from "node:fs";
import * as dotenv from "dotenv";

export const loadEnvForTests = () => {
  const envName = process.env.NODE_ENV ?? "development";
  const byName = path.resolve(process.cwd(), `.env.${envName}`);
  const def = path.resolve(process.cwd(), `.env`);
  if (fs.existsSync(byName)) dotenv.config({ path: byName, override: false });
  else if (fs.existsSync(def)) dotenv.config({ path: def, override: false });
};
