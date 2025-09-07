import { awsEcrDescribeRepositories } from "../aws";
import { pushRoute } from "../store";
import { log } from "../util/log";
import { registerRoute } from "./factory/registerRoute";

registerRoute({
  id: 'repositories',
  alias: ['repos', 'repositories'],
  actions: [
    { key: 'r', name: 'Refresh' },
    { key: 'enter', name: 'Open' },
  ],
  args: (a: {}) => ({}),
  aws: async () => {
    const repositories = await awsEcrDescribeRepositories();
    return repositories.map((r) => ({
      ...r,
      CreatedAt: r.createdAt?.split('T')[0] || '',
    }));
  },
  title: () => 'repositories',
  columns: [
    { title: 'REPOSITORY NAME', render: 'repositoryName' },
    { title: 'CREATED', render: 'CreatedAt' },
    { title: 'TAG MUTABILITY', render: 'imageTagMutability' },
  ],
  onEnter: (item) => {
    pushRoute({
      id: 'images',
      args: { repositoryName: item.repositoryName }
    });
  },
  onKey: () => {},
});
