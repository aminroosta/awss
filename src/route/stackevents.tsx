import { awsCfDescribeStackEvents } from "../aws";
import { registerRoute } from "./factory/registerRoute";

registerRoute({
  id: 'stackevents',
  alias: [],
  actions: [
    { key: 'r', name: 'Refresh' },
  ],
  args: (a: { stackName: string }) => ({ stackName: a.stackName }),
  aws: ({ stackName }) => awsCfDescribeStackEvents(stackName).then(events => 
    events.map(e => ({
      ...e,
      ResourceStatusReason: e.ResourceStatusReason || '',
      'Timestamp': (e.Timestamp || '').split('T')[0] + ' ' + (e.Timestamp || '').split('T')[1]?.split('.')[0],
    }))
  ),
  title: (args) => `${args.stackName} events`,
  columns: [
    { title: 'RESOURCE', render: 'LogicalResourceId' },
    { title: 'TYPE', render: 'ResourceType' },
    { title: 'STATUS', render: 'ResourceStatus' },
    { title: 'REASON', render: 'ResourceStatusReason' },
    { title: 'TIMESTAMP', render: 'Timestamp' },
  ],
  onKey: (key, item) => { },
});
