import { awsEcsListTasks } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { pushRoute } from "../store";

registerRoute({
  id: "cluster_tasks",
  alias: [],
  args: (args: {
    clusterArn: string;
    clusterName: string;
    serviceName?: string;
  }) => args,
  aws: (args) => awsEcsListTasks(args.clusterArn, args.serviceName),
  title: () => "tasks",
  filter: (args) =>
    args.clusterName + (args.serviceName ? "/" + args.serviceName : ""),
  columns: [
    { title: "TASK", render: "id" },
    { title: "LAST STATUS", render: "lastStatus" },
    { title: "DESIRED STATUS", render: "desiredStatus" },
    { title: "STARTED AT", render: "startedAt" },
    { title: "STOPPED AT", render: "stoppedAt" },
    { title: "STOPPED REASON", render: "stoppedReason" },
  ],
  keymaps: [],
});
