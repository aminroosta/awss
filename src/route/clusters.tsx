import { awsEcsDescribeClusters, awsUrls } from "../api";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import { pushRoute } from "../store";
import { registerYamlRoute } from "./yaml";
import { awsEcsDescribeClusterYaml } from "../api";

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
      name: "Tasks",
      fn: (item) =>
        pushRoute({
          id: "cluster_tasks",
          args: { clusterArn: item.clusterArn, clusterName: item.clusterName },
        }),
    },
    {
      key: "y",
      name: "YAML",
      fn: async (item) => {
        pushRoute({
          id: "cluster_yaml",
          args: { clusterArn: item.clusterArn },
        });
      },
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
      key: "s",
      name: "Services",
      fn: (item) =>
        pushRoute({
          id: "cluster_services",
          args: { clusterArn: item.clusterArn, clusterName: item.clusterName },
        }),
    }
  ],
});

registerYamlRoute({
  id: "cluster_yaml",
  args: (a: { clusterArn: string }) => a,
  aws: (args) => awsEcsDescribeClusterYaml(args.clusterArn),
  title: (args) => `Cluster: ${args.clusterArn}`,
  url: (args) => awsUrls.vpc!(args.clusterArn)
});
