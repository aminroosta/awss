import { createResource } from "solid-js";
import { awsEc2DescribeVpcs } from "../aws";
import { List } from "../ui/list";
import { Title } from "../ui/title";
import { revision } from "../store";
import { openInBrowser } from "../util/system";
import type { ParsedKey } from "@opentui/core";

export const Vpcs = () => {
  const [vpcs] = createResource(
    () => ({ revision: revision() }),
    () => awsEc2DescribeVpcs(),
    { initialValue: [{ VpcId: '⏳', State: '', CidrBlock: '', IsDefault: false, Tags: [] } as any] }
  );

  const onEnter = (vpc: any) => { };
  const onKey = (key: ParsedKey, vpc: any) => {
    if (key.name === 'a' && vpc) {
      openInBrowser(vpc);
    }
  }

  const vpcsFormatted = () => vpcs().map(v => ({
    ...v,
    Default: v.IsDefault ? 'Yes' : 'No',
  }));


  return (
    <box flexGrow={1}>
      <Title
        title="vpcs"
        filter='all'
        count={vpcs.loading ? '⏳' : vpcs().length}
      />
      <List items={vpcsFormatted()}
        onEnter={onEnter}
        onKey={onKey}
        columns={[
          { title: 'VPC ID', render: 'VpcId' },
          { title: 'STATE', render: 'State' },
          { title: 'CIDR BLOCK', render: 'CidrBlock' },
          { title: 'DEFAULT', render: 'Default' },
        ]} />
    </box>
  );
};
