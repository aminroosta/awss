import { createResource } from "solid-js";
import { awsEc2DescribeVpcs } from "../aws";
import { List } from "../ui/list";
import { Title } from "../ui/title";
import { revision } from "../store";
import { openInBrowser } from "../util/system";

export const Vpcs = () => {
  const [vpcs] = createResource(
    () => ({ revision: revision() }),
    () => awsEc2DescribeVpcs(),
    { initialValue: [{ VpcId: '⏳', State: '', CidrBlock: '', IsDefault: false, Tags: [] } as any] }
  );

  const onEnter = (vpc: any) => {
    openInBrowser(vpc);
  };

  return (
    <box flexGrow={1}>
      <Title
        title="vpcs"
        filter='all'
        count={vpcs.loading ? '⏳' : vpcs().length}
      />
      <List items={vpcs()}
        onEnter={onEnter}
        columns={[
          { title: 'VPC ID', render: 'VpcId' },
          { title: 'STATE', render: 'State' },
          { title: 'CIDR BLOCK', render: 'CidrBlock' },
          { title: 'DEFAULT', render: (vpc: any) => vpc.IsDefault ? 'Yes' : 'No' },
        ]} />
    </box>
  );
};
