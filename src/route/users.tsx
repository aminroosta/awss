import { awsIamListUsers, awsRegion } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import type { ParsedKey } from "@opentui/core";

registerRoute({
  id: 'users',
  alias: ['users'],
  actions: [
    { key: 'r', name: 'Refresh' },
    { key: 'a', name: 'Aws Website' },
  ],
  args: () => ({}),
  aws: async () => {
    const data = await awsIamListUsers();
    return data.map(u => ({
      ...u,
      'CreateDate': u.CreateDate?.split('T')[0],
    }));
  },
  title: () => 'users',
  filter: () => 'all',
  columns: [
    { title: 'USER NAME', render: 'UserName' },
    { title: 'USER ID', render: 'UserId' },
    { title: 'ARN', render: 'Arn' },
    { title: 'CREATED', render: 'CreateDate' },
  ],
  onEnter: () => {},
  onKey: async (key, item) => {
    if (key.name === 'a' && item) {
      const region = await awsRegion();
      openInBrowser(`https://console.aws.amazon.com/iam/home?region=${region}#/users/${item.UserName}`);
    }
  },
});
