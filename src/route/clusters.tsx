import { awsEcsDescribeClusters, awsUrls } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";

registerRoute({
  id: "clusters",
  alias: ["clusters"],
  args: () => ({}),
  aws: async () => await awsEcsDescribeClusters(),
  title: () => "clusters",
  filter: () => "all",
  columns: [
    { title: "CLUSTER", render: "clusterName" },
    { title: "PENDING/RUNNING", render: "pendingRunning", justify: "center" },
    { title: "STATUS", render: "status" },
    { title: "SERVICES", render: "activeServicesCount", justify: "center"  },
    { title: "INSTANCES", render: "registeredContainerInstancesCount", justify: "center"  },
  ],
  keymaps: [
    {
      key: { name: "a", ctrl: false },
      name: "AWS Website",
      when: (item) => !!item,
      fn: async (item) => {
        const url = await awsUrls.clusters!(item.clusterArn);
        openInBrowser(url);
      },
    },
  ],
});
