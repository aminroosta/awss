import { createResource } from "solid-js";
import { awsEc2DescribeVpcs } from "../aws";
import { List } from "../ui/list";
import { Title } from "../ui/title";
import { revision } from "../store";

export const Vpcs = () => {
  const [vpcs] = createResource(
    () => revision(),
    () => awsEc2DescribeVpcs(),
    { initialValue: [{ VpcId: '⏳', State: '', CidrBlock: '', IsDefault: false, Tags: [] }] }
  );

  const onEnter = (vpc: any) => {
    // VPC navigation logic can be added here if needed
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