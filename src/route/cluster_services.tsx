import { awsEcsListServices, awsEcsServiceYaml, awsUrls } from "../api";
import { registerRoute } from "./factory/registerRoute";
import { pushRoute } from "../store";
import { registerYamlRoute } from "./yaml";
import { openInBrowser } from "../util/system";

registerRoute({
  id: "cluster_services",
  alias: [],
  args: (args: { clusterArn: string; clusterName: string }) => args,
  aws: (args) => awsEcsListServices(args.clusterArn),
  title: () => "services",
  filter: (args) => args.clusterName,
  columns: [
    { title: "SERVICE", render: "serviceName" },
    { title: "PENDING/RUNNING", render: "pendingRunning", justify: "center" },
    { title: "DESIRED", render: "desiredCount", justify: "center" },
    { title: "STATUS", render: "status" },
  ],
  keymaps: [
    {
      key: "t",
      name: "Tasks",
      fn: (item, args) =>
        pushRoute({
          id: "cluster_tasks",
          args: {
            clusterArn: args.clusterArn,
            clusterName: args.clusterName,
            serviceName: item.serviceName,
          },
        }),
    },
    {
      key: "y",
      name: "YAML",
      fn: async (item, args) => {
        pushRoute({
          id: "cluster_service_yaml",
          args: { ...item, ...args },
        });
      },
    },
    {
      key: { name: "a", ctrl: false },
      name: "AWS Website",
      when: (item) => !!item,
      fn: async (item, args) => {
        const url = await awsUrls.cluster_service!(
          item.serviceName,
          args.clusterArn.split("/").pop()!,
        );
        openInBrowser(url);
      },
    },
  ],
});

registerYamlRoute({
  id: "cluster_service_yaml",
  args: (a: { clusterArn: string; serviceArn: string; serviceName: string }) =>
    a,
  aws: (args) => awsEcsServiceYaml(args.clusterArn, args.serviceArn),
  title: (args) => `Cluster: ${args.clusterArn}`,
  url: (args) =>
    awsUrls.cluster_service!(
      args.serviceName,
      args.clusterArn.split("/").pop()!,
    ),
});
