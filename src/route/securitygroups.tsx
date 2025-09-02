import { createResource } from "solid-js";
import { awsEc2DescribeSecurityGroups } from "../aws";
import { List } from "../ui/list";
import { Title } from "../ui/title";
import { revision } from "../store";
import { openInBrowser } from "../util/system";

export const SecurityGroups = () => {
  const [securityGroups] = createResource(
    () => ({ revision: revision() }),
    () => awsEc2DescribeSecurityGroups(),
    { initialValue: [{ GroupId: '⏳', GroupName: '', Description: '', VpcId: '', Tags: [] } as any] }
  );

  const onEnter = (securityGroup: any) => {
    openInBrowser(securityGroup);
  };

  return (
    <box flexGrow={1}>
      <Title
        title="security groups"
        filter='all'
        count={securityGroups.loading ? '⏳' : securityGroups().length}
      />
      <List items={securityGroups()}
        onEnter={onEnter}
        columns={[
          { title: 'GROUP ID', render: 'GroupId' },
          { title: 'NAME', render: 'GroupName' },
          { title: 'DESCRIPTION', render: 'Description' },
          { title: 'VPC ID', render: 'VpcId' },
        ]} />
    </box>
  );
};