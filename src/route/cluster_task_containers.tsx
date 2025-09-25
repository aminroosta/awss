import { awsEcsListTasks } from "../api";
import { ecsExecPopup } from "../util/tmux";
import { registerRoute } from "./factory/registerRoute";

registerRoute({
  id: "cluster_task_containers",
  alias: [],
  args: (args: {
    clusterArn: string;
    clusterName: string;
    taskId: string;
    serviceName?: string;
  }) => args,
  aws: async (args) => {
    const tasks = await awsEcsListTasks(args.clusterArn, args.serviceName);
    const task = tasks.find((t) => t.id === args.taskId);
    if (!task) return [];
    return task.containers.map((c) => ({
      name: c.name || "",
      lastStatus: c.lastStatus || "",
      exitCode: c.exitCode !== undefined ? String(c.exitCode) : "",
      reason: c.reason || "",
    }));
  },
  title: () => "containers",
  filter: (args) => `${args.clusterName}/${args.taskId}`,
  columns: [
    { title: "CONTAINER", render: "name" },
    { title: "STATUS", render: "lastStatus" },
    { title: "EXIT", render: "exitCode", justify: "center" },
    { title: "REASON", render: "reason" },
  ],
  keymaps: [
    {
      key: "t",
      name: "terminal",
      fn: async (item, args) => {
        ecsExecPopup(args.clusterName, args.taskId, item.name);
      },
    },
  ],
});
