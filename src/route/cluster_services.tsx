import { awsEcsListServices } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { pushRoute } from "../store";

registerRoute({
  id: "cluster_services",
  alias: [],
  args: (args: { clusterArn: string; clusterName: string }) => args,
  aws: (args) => awsEcsListServices(args.clusterArn),
  title: () => 'services',
  filter: (args) => args.clusterName,
  columns: [
    { title: "SERVICE", render: "serviceName" },
    { title: "PENDING/RUNNING", render: "pendingRunning", justify: "center" },
    { title: "DESIRED", render: "desiredCount", justify: "center" },
    { title: "STATUS", render: "status" },
  ],
  keymaps: [],
});
