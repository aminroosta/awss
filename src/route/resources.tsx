import { createResource, Show } from "solid-js";
import { awsCfListStackResources } from "../aws";
import { Title } from "../ui/title";
import { List } from "../ui/list";
import { revision } from "../store";

export const Resources = (p: { args: { stackName: string } }) => {
  const [resources] = createResource(
    () => ({ stackName: p.args.stackName, revision: revision() }),
    ({ stackName }) => awsCfListStackResources(stackName),
    {
      initialValue: {
        StackResourceSummaries: [{
          LogicalResourceId: '⏳',
          PhysicalResourceId: '',
          ResourceType: '',
          LastUpdatedTimestamp: '',
          ResourceStatus: '',
        }]
      }
    }
  );

  const resourcesFormatted = () => resources().StackResourceSummaries.map(r => ({
    ...r,
    'LastUpdatedTimestamp': (r.LastUpdatedTimestamp || '').split('T')[0],
  }));

  return (
    <box flexGrow={1}>
      <Title
        title={p.args.stackName}
        filter={'all'}
        count={resources.loading ? '⏳' : resources().StackResourceSummaries.length}
      />
      <List
        items={resourcesFormatted()}
        onEnter={() => { }}
        columns={[
          { title: 'Name', render: 'LogicalResourceId' },
          { title: 'TYPE', render: 'ResourceType' },
          { title: 'STATUS', render: 'ResourceStatus' },
          { title: 'UPDATED', render: 'LastUpdatedTimestamp' },
        ]}
      />
    </box>
  );
};
