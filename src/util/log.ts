import * as fs from "fs";

export function log(obj: object): void {
  const logPath = "/tmp/awss.log";
  const logMessage = `[${new Date().toISOString()}] ${JSON.stringify(obj, null, 2)}\n`;
  fs.appendFileSync(logPath, logMessage, { encoding: "utf8" });
}
