import * as fs from "fs";

let CONFIG_FILE = `${process.env.HOME}/.config/awss/config.json`;


export interface ConfigData {
  ssh?: string;
}

export function loadConfig(): ConfigData {
  if (fs.existsSync(CONFIG_FILE)) {
    const data = fs.readFileSync(CONFIG_FILE, "utf8");
    return JSON.parse(data);
  }
  return {};
}
