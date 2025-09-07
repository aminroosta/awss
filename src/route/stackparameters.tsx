import { awsCfDescribeStack } from "../aws";
import { registerRoute } from "./factory/registerRoute";

registerRoute({
  id: 'stackparameters',
  alias: [],
  args: (a: { stackName: string }) => ({ stackName: a.stackName }),
  aws: ({ stackName }) => awsCfDescribeStack(stackName).then(s => s.Parameters || []),
  title: (args) => `${args.stackName} parameters`,
  columns: [
    { title: 'PARAMETER', render: 'ParameterKey' },
    { title: 'VALUE', render: 'ParameterValue' },
  ],
  keymaps: [
    { key: 'r', name: 'Refresh', fn: () => {} },
  ],
});
