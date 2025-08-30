import { $ } from "bun";
import os from "os";
import process from "process";
import { createResource } from "solid-js";

export async function getSystemUsage() {
  // Calculate memory usage
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memUsage = ((totalMem - freeMem) / totalMem) * 100;

  // Calculate CPU usage requires a bit more work because Node.js doesn't provide
  // a straightforward way to get current CPU usage. We'll average the load over
  // the last minute, which might not be perfectly accurate but gives a good
  // indication. For precise measurements, consider using a dedicated library
  // or executing system commands (e.g., `ps` or `top`).
  const loadavg = os.loadavg()[0]!; // 1-minute load average
  const cpuUsage = loadavg / os.cpus().length * 100; // Normalize by number of CPUs

  // Format the output as requested
  return {
    cpu: `${cpuUsage.toFixed(0)}%`,
    mem: `${memUsage.toFixed(0)}%`
  };
}


export async function getSystemTheme() {
  if (process.platform === "darwin") {
    try {
      let theme = await $`defaults read -g AppleInterfaceStyle`.text();
      return theme.toLowerCase().trim();
    } catch {
      return "light";
    }
  }
  return "dark";
}

const [usage, usageActions] = createResource(getSystemUsage, { initialValue: { cpu: '⏳', mem: '⏳' } });

setInterval(() => {
  usageActions.refetch();
}, 1000);

export { usage };
