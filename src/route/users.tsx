import { createResource } from "solid-js";
import { awsIamListUsers } from "../aws";
import { List } from "../ui/list";
import { Title } from "../ui/title";
import { revision } from "../store";
import { openInBrowser } from "../util/system";
import type { ParsedKey } from "@opentui/core";

export const Users = () => {
  const [users] = createResource(
    () => ({ revision: revision() }),
    () => awsIamListUsers(),
    { initialValue: [{ UserName: '⏳', UserId: '', Arn: '', Path: '', CreateDate: '', Tags: [] } as any] }
  );

  const onEnter = (user: any) => { };
  const onKey = (key: ParsedKey, user: any) => {
    if (key.name === 'a' && user) {
      openInBrowser(user);
    }
  }

  const usersFormatted = () => users().map(u => ({
    ...u,
    'CreateDate': u.CreateDate?.split('T')[0],
  }));

  return (
    <box flexGrow={1}>
      <Title
        title="users"
        filter='all'
        count={users.loading ? '⏳' : users().length}
      />
      <List items={usersFormatted()}
        onEnter={onEnter}
        onKey={onKey}
        columns={[
          { title: 'USER NAME', render: 'UserName' },
          { title: 'USER ID', render: 'UserId' },
          { title: 'ARN', render: 'Arn' },
          { title: 'CREATED', render: 'CreateDate' },
        ]} />
    </box>
  );
};
