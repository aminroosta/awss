import { $ } from "bun";
import os from "os";
import process from "process";
import { createResource } from "solid-js";
import { awsRegion } from "../aws";
import { setNotification } from "../store";

export async function getSystemUsage() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memUsage = ((totalMem - freeMem) / totalMem) * 100;

  const loadavg = os.loadavg()[0]!; // 1-minute load average
  const cpuUsage = loadavg / os.cpus().length * 100; // Normalize by number of CPUs

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

export async function openInBrowser(
  item: { VpcId?: string; InstanceId?: string }
) {
  const region = await awsRegion();

  let url: string | undefined;

  if (item.InstanceId) {
    url = `https://${region}.console.aws.amazon.com/ec2/home?region=${region}#InstanceDetails:instanceId=${item.InstanceId}`;
  } else if (item.VpcId) {
    url = `https://${region}.console.aws.amazon.com/vpc/home?region=${region}#VpcDetails:VpcId=${item.VpcId}`;
  }

  if (!url) {
    setNotification({ level: 'warn', message: 'Unsupported resource to open', timeout: 2000 });
    return;
  }

  try {
    if (process.platform === "darwin") {
      await $`open ${url}`;
    } else if (process.platform === "linux") {
      await $`xdg-open ${url}`;
    } else if (process.platform === "win32") {
      await $`start ${url}`;
    }
    setNotification({ level: 'info', message: 'Opened in browser', timeout: 1500 });
  } catch {
    setNotification({ level: 'error', message: 'Failed to open browser', timeout: 2500 });
  }
}
