import { awsListBuckets } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { pushRoute } from "../store";

registerRoute({
  id: 'buckets',
  alias: ['s3', 'buckets'],
  actions: [
    { key: 'r', name: 'Refresh' },
    { key: 'enter', name: 'Open' },
  ],
  args: () => ({}),
  aws: async () => {
    const data = await awsListBuckets();
    return data.Buckets;
  },
  title: () => 'buckets',
  filter: () => 'all',
  columns: [
    { title: 'BUCKET', render: 'Name' },
    { title: 'CREATED', render: 'CreationDate' },
  ],
  onEnter: (item) => {
    pushRoute({
      id: 'objects',
      args: { bucket: item.Name.trim(), prefix: '' }
    });
  },
  onKey: () => {},
});
