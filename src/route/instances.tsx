import { createResource } from "solid-js";
import { awsEc2DescribeInstances } from "../aws";
import { List } from "../ui/list";
import { Title } from "../ui/title";
import { revision } from "../store";
import { openInBrowser } from "../util/system";

const getTag = (item: any, key: string) => item?.Tags?.find((t: any) => t.Key === key)?.Value || '';

export const Instances = () => {
  const [instances] = createResource(
    () => ({ revision: revision() }),
    () => awsEc2DescribeInstances(),
    {
      initialValue: [{
        Tags: [],
        InstanceId: '⏳',
        State: { Name: '' },
        InstanceType: '',
        Monitoring: { State: '' },
        Placement: { AvailabilityZone: '' },
        PublicDnsName: '',
        PublicIpAddress: '',
        NetworkInterfaces: [],
        KeyName: '',
        LaunchTime: '',
        PlatformDetails: '',
      }] as any
    }
  );

  const onEnter = (instance: any) => {
    openInBrowser(instance);
  };

  const instancesFormatted = () =>
    instances().map(i => ({
      Name: getTag(i, 'Name'),
      InstanceId: i.InstanceId,
      State: i.State?.Name || '',
      PublicIpAddress: i.PublicIpAddress || i.NetworkInterfaces?.[0]?.Association?.PublicIp || '',
      Age: (() => {
        if (!i.LaunchTime) return '';
        const diffMs = Date.now() - new Date(i.LaunchTime).getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return diffDays > 99 ? `${diffDays}d` : `${diffDays}d ${diffHours}h`;
      })(),
      InstanceType: i.InstanceType,
      Zone: i.Placement?.AvailabilityZone || '',
    }));

  const columns = [
    { title: 'NAME', render: 'Name' },
    { title: 'INSTANCE ID', render: 'InstanceId' },
    { title: 'STATE', render: 'State' },
    { title: 'IPV4', render: 'PublicIpAddress' },
    { title: 'AGE', render: 'Age' },
    { title: 'TYPE', render: 'InstanceType' },
    { title: 'A. ZONE', render: 'Zone' },
  ];

  return (
    <box flexGrow={1}>
      <Title
        title="instances"
        filter='all'
        count={instances.loading ? '⏳' : instances().length}
      />
      <List items={instancesFormatted()}
        onEnter={onEnter}
        columns={columns} />
    </box>
  );
};
