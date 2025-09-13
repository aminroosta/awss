import { awsEc2GetConsoleOutput, awsUrls } from "../aws";
import { log } from "../util/log";
import { registerRoute } from "./factory/registerRoute";

registerRoute({
  id: "instance_log",
  alias: [],
  args: (a: { InstanceId: string }) => a,
  aws: async (args) => {
    const result = await awsEc2GetConsoleOutput(args.InstanceId);
    const all = result
      .split("\n")
      .map((line, idx) => ({ line: line.replace(/[\p{Cc}]/gu, "").trim() }));

    return all;
  },
  title: (args) => args.InstanceId,
  columns: [{ title: "LOGS", render: "line" }],
  keymaps: [],
});
