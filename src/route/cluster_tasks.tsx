import { awsEcsListTasks, awsEcsTaskYaml, awsUrls } from "../api";
import { registerRoute } from "./factory/registerRoute";
import { pushRoute } from "../store";
import { registerYamlRoute } from "./yaml";
import { openInBrowser } from "../util/system";

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
  keymaps: [
    {
      key: "return",
      name: "Containers",
      fn: (item, args) =>
        pushRoute({
          id: "cluster_task_containers",
          args: {
            clusterArn: args.clusterArn,
            clusterName: args.clusterName,
            taskId: item.id,
            serviceName: args.serviceName,
          },
        }),
    },
    {
      key: "y",
      name: "YAML",
      fn: async (item, args) => {
        pushRoute({
          id: "cluster_task_yaml",
          args: { ...item, ...args },
        });
      },
    },
    {
      key: { name: "a", ctrl: false },
      name: "AWS Website",
      when: (item) => !!item,
      fn: async (item, args) => {
        const url = await awsUrls.cluster_task!(item.id, args.clusterName);
        openInBrowser(url);
      },
    },
  ],
});

registerYamlRoute({
  id: "cluster_task_yaml",
  args: (a: { clusterArn: string, clusterName: string, id: string, taskArn: string }) => a,
  aws: (a) => awsEcsTaskYaml(a.clusterArn, a.taskArn),
  title: (a) => `Task: ${a.taskArn}`,
  url: (a) => awsUrls.cluster_task!(a.id, a.clusterName)
});
