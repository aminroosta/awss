import * as fs from "fs";

const SESSION_FILE = "/tmp/awss.session.json";

export interface SessionData {
  lastRouteId?: string;
}

export function saveSession(data: SessionData): void {
  fs.writeFileSync(SESSION_FILE, JSON.stringify(data, null, 2));
}

export function loadSession(): SessionData {
  if (fs.existsSync(SESSION_FILE)) {
    const data = fs.readFileSync(SESSION_FILE, "utf8");
    return JSON.parse(data);
  }
  return {};
}
