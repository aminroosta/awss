import { awsEc2GetConsoleOutput, awsUrls } from "../aws";
import { openInVim } from "../util/vim";
import { setNotification } from "../store";
import { log } from "../util/log";
import { registerRoute } from "./factory/registerRoute";

registerRoute({
  id: "instance_log",
  alias: [],
  args: (a: { InstanceId: string }) => a,
  aws: async (args) => {
    const result = await awsEc2GetConsoleOutput(args.InstanceId);
    // Preserve original line content (no trimming) but strip control chars that break rendering
    const all = result
      .split("\n")
      .map((line) => ({ line: line.replace(/[\p{Cc}]/gu, "") }));
    return all;
  },
  title: (args) => args.InstanceId,
  columns: [{ title: "LOGS", render: "line" }],
  keymaps: [
    {
      key: "n",
      name: "Open in neovim",
      when: () => true,
      fn: async (_, args) => {
        setNotification({
          level: "info",
          message: "Opening in neovim …",
          timeout: 1500,
        });
        const content = await awsEc2GetConsoleOutput(args.InstanceId);
        setNotification(null as any);
        await openInVim(content, args.InstanceId + ".log");
      },
    },
  ],
});
