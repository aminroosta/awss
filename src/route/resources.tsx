import { awsCfListStackResources } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import type { ParsedKey } from "@opentui/core";

registerRoute({
  id: 'resources',
  alias: [],
  actions: [
    { key: 'r', name: 'Refresh' },
  ],
  args: (a: { stackName: string }) => a,
  aws: async ({ stackName }) => {
    const data = await awsCfListStackResources(stackName);
    return data.StackResourceSummaries.map(r => ({
      ...r,
      'LastUpdatedTimestamp': (r.LastUpdatedTimestamp || '').split('T')[0],
    }));
  },
  title: (args) => args.stackName,
  filter: () => 'all',
  columns: [
    { title: 'Name', render: 'LogicalResourceId' },
    { title: 'TYPE', render: 'ResourceType' },
    { title: 'STATUS', render: 'ResourceStatus' },
    { title: 'UPDATED', render: 'LastUpdatedTimestamp' },
  ],
  onEnter: () => {},
  onKey: () => {},
});
