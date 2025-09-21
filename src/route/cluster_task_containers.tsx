import { awsEcsListTasks } from "../api";
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
    if (!task) return [] as any[];
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
  keymaps: [],
});
