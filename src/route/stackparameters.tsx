import { createResource } from "solid-js";
import { awsCfDescribeStack } from "../aws";
import { Title } from "../ui/title";
import { List } from "../ui/list";
import { revision } from "../store";
import { registerRoute } from "./factory/registerRoute";

registerRoute({
  id: 'stackparameters',
  alias: [],
  actions: [
    { key: 'r', name: 'Refresh' },
  ],
  args: (a: { stackName: string }) => ({ stackName: a.stackName }),
  aws: ({ stackName }) => awsCfDescribeStack(stackName).then(s => s.Parameters || []),
  title: (args) => `${args.stackName} parameters`,
  columns: [
    { title: 'PARAMETER', render: 'ParameterKey' },
    { title: 'VALUE', render: 'ParameterValue' },
  ],
  onKey: (key, item) => { },
});
