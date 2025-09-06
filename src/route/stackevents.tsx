import { createEffect, createResource } from "solid-js";
import { awsCfDescribeStackEvents } from "../aws";
import { Title } from "../ui/title";
import { List } from "../ui/list";
import { revision } from "../store";
import { log } from "../util/log";

export const StackEvents = (p: { args: { stackName: string } }) => {
  const initialValue = [{
    StackId: '',
    EventId: '',
    StackName: '',
    LogicalResourceId: '⏳',
    PhysicalResourceId: '',
    ResourceType: '',
    Timestamp: '',
    ResourceStatus: '',
    ResourceStatusReason: '',
  }];
  const [events] = createResource(
    () => ({ stackName: p.args.stackName, revision: revision() }),
    ({ stackName }) => awsCfDescribeStackEvents(stackName),
    { initialValue }
  );

  const eventsFormatted = () => events.loading ? initialValue : events().map(e => ({
    ...e,
    ResourceStatusReason: e.ResourceStatusReason || '',
    'Timestamp': (e.Timestamp || '').split('T')[0] + ' ' + (e.Timestamp || '').split('T')[1]?.split('.')[0],
  }));

  return (
    <box flexGrow={1}>
      <Title
        title={`${p.args.stackName} events`}
        filter={'all'}
        count={events.loading ? '⏳' : events().length}
      />
      <List
        items={eventsFormatted()}
        onEnter={() => { }}
        columns={[
          { title: 'RESOURCE', render: 'LogicalResourceId' },
          { title: 'TYPE', render: 'ResourceType' },
          { title: 'STATUS', render: 'ResourceStatus' },
          { title: 'REASON', render: 'ResourceStatusReason' },
          { title: 'TIMESTAMP', render: 'Timestamp' },
        ]}
      />
    </box>
  );
};
