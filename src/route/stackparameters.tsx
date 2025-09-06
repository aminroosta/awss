import { createResource } from "solid-js";
import { awsCfDescribeStackParameters } from "../aws";
import { Title } from "../ui/title";
import { List } from "../ui/list";
import { revision } from "../store";

export const StackParameters = (p: { args: { stackName: string } }) => {
  const initialValue = [{
    ParameterKey: '⏳',
    ParameterValue: '',
  }];
  const [parameters] = createResource(
    () => ({ stackName: p.args.stackName, revision: revision() }),
    ({ stackName }) => awsCfDescribeStackParameters(stackName),
    { initialValue }
  );

  return (
    <box flexGrow={1}>
      <Title
        title={`${p.args.stackName} parameters`}
        filter={'all'}
        count={parameters.loading ? '⏳' : parameters().length}
      />
      <List
        items={parameters.loading ? initialValue : parameters()}
        onEnter={() => { }}
        columns={[
          { title: 'PARAMETER', render: 'ParameterKey' },
          { title: 'VALUE', render: 'ParameterValue' },
        ]}
      />
    </box>
  );
};