import { awsListStacks } from "../aws";
import { createResource, createSignal, For } from "solid-js";
import { List } from "../ui/list";
import { Title } from "../ui/title";
import { pushRoute, revision, routes, setNotification } from "../store";
import { colors } from "../util/colors";
import { TextAttributes } from "@opentui/core";

export const Stacks = () => {
  const [filter, setFilter] = createSignal('all');
  const [stacks] = createResource(
    () => ({ revision: revision() }),
    () => awsListStacks(),
    {
      initialValue: [{
        StackId: '',
        StackName: '⏳',
        CreationTime: '',
        StackStatus: '',
      }]
    });


  const statusAttrs = (item: { StackStatus: string }) => {
    const s = item.StackStatus;
    if (s.endsWith('_IN_PROGRESS')) return { fg: colors().main.v400 }
    else if (s.endsWith('_FAILED') || s.includes('ROLLBACK')) return { fg: colors().warn };
    else if (s === 'DELETE_COMPLETE') return { attributes: TextAttributes.STRIKETHROUGH, fg: colors().dim };
    else return {};
  };

  const onEnter = (stack: { StackId: string; StackName: string; StackStatus?: string }) => {
    const status = (stack.StackStatus || '').trim();
    if (!resourceCapableStatuses.has(status)) {
      setNotification({
        message: `Stack ${stack.StackName} has no resources.\nStatus: ${status || 'unknown'}`,
        level: 'error',
        timeout: 2500,
      });
      return;
    }
    pushRoute({
      ...routes.Resources,
      args: { stackName: stack.StackName.trim() }
    });
  };

  return (
    <box flexGrow={1}>
      <Title
        title="stacks"
        filter={filter()}
        count={stacks.loading ? '⏳' : stacks().length}
      />
      <List
        items={stacks()}
        onEnter={onEnter}
        columns={[
          { title: 'STACK', render: 'StackName' },
          { title: 'CREATED', render: (item: any) => item.CreationTime.split('T')[0] },
          {
            title: 'STATUS',
            render: (item: any, props: any) =>
              <text {...props} {...statusAttrs(item)}>{item.StackStatus}</text>
          },
        ]}
      />
    </box>
  );
};

const resourceCapableStatuses = new Set<string>([
  'CREATE_IN_PROGRESS',
  'CREATE_COMPLETE',
  'UPDATE_IN_PROGRESS',
  'UPDATE_COMPLETE',
  'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS',
  'UPDATE_ROLLBACK_IN_PROGRESS',
  'UPDATE_ROLLBACK_COMPLETE',
  'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS',
  'ROLLBACK_IN_PROGRESS',
  'ROLLBACK_COMPLETE',
  'ROLLBACK_FAILED',
  'IMPORT_IN_PROGRESS',
  'IMPORT_COMPLETE',
  'IMPORT_ROLLBACK_IN_PROGRESS',
  'IMPORT_ROLLBACK_COMPLETE',
  'REVIEW_IN_PROGRESS',
]);
