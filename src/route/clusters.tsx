import { awsEcsDescribeClusters, awsUrls } from "../api";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import { pushRoute } from "../store";

registerRoute({
  id: "clusters",
  alias: ["clusters"],
  args: () => ({}),
  aws: () => awsEcsDescribeClusters(),
  title: () => "clusters",
  filter: () => "all",
  columns: [
    { title: "CLUSTER", render: "clusterName" },
    { title: "PENDING/RUNNING", render: "pendingRunning", justify: "center" },
    { title: "STATUS", render: "status" },
    { title: "SERVICES", render: "activeServicesCount", justify: "center" },
    {
      title: "INSTANCES",
      render: "registeredContainerInstancesCount",
      justify: "center",
    },
  ],
  keymaps: [
    {
      key: "return",
      name: "Open",
      fn: (item) =>
        pushRoute({
          id: "cluster_services",
          args: { clusterArn: item.clusterArn, clusterName: item.clusterName },
        }),
    },
    {
      key: { name: "a", ctrl: false },
      name: "AWS Website",
      when: (item) => !!item,
      fn: async (item) => {
        const url = await awsUrls.clusters!(item.clusterArn);
        openInBrowser(url);
      },
    },
    {
      key: "t",
      name: "Tasks",
      fn: (item) =>
        pushRoute({
          id: "cluster_tasks",
          args: { clusterArn: item.clusterArn, clusterName: item.clusterName },
        }),
    },
  ],
});
