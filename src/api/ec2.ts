import { aws } from "./aws";

export const awsEc2DescribeVpcs = async () => {
  type DescribeVpcs = {
    Vpcs: {
      OwnerId: string;
      VpcId: string;
      State: string;
      CidrBlock: string;
      DhcpOptionsId: string;
      InstanceTenancy: string;
      CidrBlockAssociationSet?: {
        AssociationId: string;
        CidrBlock: string;
        CidrBlockState: { State: string };
      }[];
      IsDefault: boolean;
      Tags?: { Key: string; Value: string }[];
    }[];
  };
  let result = await aws<DescribeVpcs>(`aws ec2 describe-vpcs`);
  return result.Vpcs;
};

export const awsEc2DescribeSubnets = async () => {
  type DescribeSubnets = {
    Subnets: {
      SubnetId: string;
      VpcId: string;
      State: string;
      CidrBlock: string;
      AvailabilityZone: string;
      AvailabilityZoneId: string;
      AvailableIpAddressCount: number;
      DefaultForAz: boolean;
      MapPublicIpOnLaunch: boolean;
      OwnerId: string;
      AssignIpv6AddressOnCreation: boolean;
      Ipv6CidrBlockAssociationSet?: {
        AssociationId: string;
        Ipv6CidrBlock: string;
        Ipv6CidrBlockState: { State: string };
      }[];
      Tags?: { Key: string; Value: string }[];
    }[];
  };
  const result = await aws<DescribeSubnets>(`aws ec2 describe-subnets`);
  return result.Subnets;
};

export const awsEc2DescribeSubnet = async (subnetId: string) => {
  type DescribeSubnets = {
    Subnets: {
      SubnetId: string;
      VpcId: string;
      State: string;
      CidrBlock: string;
      AvailabilityZone: string;
      AvailabilityZoneId: string;
      AvailableIpAddressCount: number;
      DefaultForAz: boolean;
      MapPublicIpOnLaunch: boolean;
      OwnerId: string;
      AssignIpv6AddressOnCreation: boolean;
      Ipv6CidrBlockAssociationSet?: {
        AssociationId: string;
        Ipv6CidrBlock: string;
        Ipv6CidrBlockState: { State: string };
      }[];
      Tags?: { Key: string; Value: string }[];
    }[];
  };
  const result = await aws<DescribeSubnets>(
    `aws ec2 describe-subnets --subnet-ids='${subnetId}'`,
  );
  return result.Subnets[0]!;
};

export const awsEc2DescribeSubnetYaml = (subnetId: string) =>
  aws(`aws ec2 describe-subnets --subnet-ids='${subnetId}'`, "yaml");

export const awsEc2GetConsoleOutput = async (instanceId: string) =>
  aws(
    `aws ec2 get-console-output --latest --instance-id='${instanceId}'`,
    "text",
  );

export const awsEc2DescribeSecurityGroups = async () => {
  type DescribeSecurityGroups = {
    SecurityGroups: {
      Description: string;
      GroupName: string;
      IpPermissions: {
        FromPort?: number;
        ToPort?: number;
        IpProtocol: string;
        IpRanges: { CidrIp: string; Description?: string }[];
        Ipv6Ranges: { CidrIpv6: string; Description?: string }[];
        PrefixListIds: { PrefixListId: string; Description?: string }[];
        UserIdGroupPairs: {
          GroupId: string;
          GroupName?: string;
          VpcId?: string;
        }[];
      }[];
      OwnerId: string;
      GroupId: string;
      VpcId?: string;
      Tags?: { Key: string; Value: string }[];
      SecurityGroupArn: string;
      IpPermissionsEgress?: {
        FromPort?: number;
        ToPort?: number;
        IpProtocol: string;
        IpRanges: { CidrIp: string; Description?: string }[];
        Ipv6Ranges: { CidrIpv6: string; Description?: string }[];
        PrefixListIds: { PrefixListId: string; Description?: string }[];
        UserIdGroupPairs: {
          GroupId: string;
          GroupName?: string;
          VpcId?: string;
        }[];
      }[];
    }[];
  };
  const result = await aws<DescribeSecurityGroups>(
    `aws ec2 describe-security-groups`,
  );
  return result.SecurityGroups;
};

export const awsEc2DescribeSecurityGroupYaml = async (
  groupIdOrGroupName: string,
) => {
  const isId = groupIdOrGroupName.startsWith("sg-");
  const flag = isId ? "--group-ids" : "--group-names";
  return aws(
    `aws ec2 describe-security-groups ${flag}='${groupIdOrGroupName}'`,
    "yaml",
  );
};

export const awsEc2DescribeSecurityGroup = async (
  groupIdOrGroupName: string,
) => {
  const isId = groupIdOrGroupName.startsWith("sg-");
  const flag = isId ? "--group-ids" : "--group-names";
  type DescribeSecurityGroup = {
    SecurityGroups: {
      Description: string;
      GroupName: string;
      IpPermissions: {
        FromPort?: number;
        ToPort?: number;
        IpProtocol: string;
        IpRanges: { CidrIp: string; Description?: string }[];
        Ipv6Ranges: { CidrIpv6: string; Description?: string }[];
        PrefixListIds: { PrefixListId: string; Description?: string }[];
        UserIdGroupPairs: {
          GroupId: string;
          GroupName?: string;
          VpcId?: string;
        }[];
      }[];
      OwnerId: string;
      GroupId: string;
      VpcId?: string;
      Tags?: { Key: string; Value: string }[];
      SecurityGroupArn: string;
      IpPermissionsEgress?: {
        FromPort?: number;
        ToPort?: number;
        IpProtocol: string;
        IpRanges: { CidrIp: string; Description?: string }[];
        Ipv6Ranges: { CidrIpv6: string; Description?: string }[];
        PrefixListIds: { PrefixListId: string; Description?: string }[];
        UserIdGroupPairs: {
          GroupId: string;
          GroupName?: string;
          VpcId?: string;
        }[];
      }[];
    }[];
  };
  const result = await aws<DescribeSecurityGroup>(
    `aws ec2 describe-security-groups ${flag}='${groupIdOrGroupName}'`,
  );
  return result.SecurityGroups[0];
};

export const awsEc2DescribeVpcYaml = async (vpcId: string) =>
  aws(`aws ec2 describe-vpcs --vpc-ids='${vpcId}'`, "yaml");

export const awsEc2DescribeVpc = async (vpcId: string) => {
  type DescribeVpcs = {
    Vpcs: {
      OwnerId: string;
      VpcId: string;
      State: string;
      CidrBlock: string;
      DhcpOptionsId: string;
      InstanceTenancy: string;
      CidrBlockAssociationSet?: {
        AssociationId: string;
        CidrBlock: string;
        CidrBlockState: { State: string };
      }[];
      IsDefault: boolean;
      Tags?: { Key: string; Value: string }[];
    }[];
  };
  const result = await aws<DescribeVpcs>(
    `aws ec2 describe-vpcs --vpc-ids='${vpcId}'`,
  );
  return result.Vpcs[0];
};

export const awsEc2DescribeInstances = async () => {
  type DescribeInstances = {
    Reservations: {
      ReservationId: string;
      OwnerId: string;
      RequesterId: string;
      Groups: { GroupName: string; GroupId: string }[];
      Instances: {
        InstanceId: string;
        ImageId: string;
        State: { Code: number; Name: string };
        PrivateDnsName?: string;
        PublicDnsName?: string;
        InstanceType: string;
        LaunchTime: string;
        Placement: {
          AvailabilityZone: string;
          GroupName: string;
          Tenancy: string;
        };
        Monitoring: { State: string };
        SubnetId?: string;
        VpcId?: string;
        PrivateIpAddress?: string;
        PublicIpAddress?: string;
        Architecture: string;
        RootDeviceType: string;
        RootDeviceName: string;
        Hypervisor: string;
        EnaSupport: boolean;
        EbsOptimized: boolean;
        ClientToken?: string;
        BlockDeviceMappings?: {
          DeviceName: string;
          Ebs: {
            VolumeId: string;
            Status: string;
            AttachTime: string;
            DeleteOnTermination: boolean;
          };
        }[];
        NetworkInterfaces?: {
          Association?: {
            IpOwnerId?: string;
            PublicDnsName?: string;
            PublicIp?: string;
          };
          Attachment?: {
            AttachTime: string;
            AttachmentId: string;
            DeleteOnTermination: boolean;
            DeviceIndex: number;
            Status: string;
            NetworkCardIndex?: number;
          };
          Description?: string;
          Groups: { GroupId: string; GroupName: string }[];
          Ipv6Addresses?: any[];
          MacAddress: string;
          NetworkInterfaceId: string;
          OwnerId: string;
          PrivateDnsName: string;
          PrivateIpAddress: string;
          PrivateIpAddresses: {
            Association?: {
              IpOwnerId?: string;
              PublicDnsName?: string;
              PublicIp?: string;
            };
            Primary: boolean;
            PrivateDnsName: string;
            PrivateIpAddress: string;
          }[];
          SourceDestCheck: boolean;
          Status: string;
          SubnetId: string;
          VpcId: string;
          InterfaceType: string;
          Operator?: { Managed: boolean };
        }[];
        Tags?: { Key: string; Value: string }[];
      }[];
    }[];
  };
  const result = await aws<DescribeInstances>(`aws ec2 describe-instances`);
  return result.Reservations.flatMap((r) => r.Instances);
};

export const awsEc2DescribeInstanceYaml = (instanceId: string) =>
  aws(`aws ec2 describe-instances --instance-ids='${instanceId}'`, "yaml");

export const awsEc2DescribeInstance = async (instanceId: string) => {
  type DescribeInstance = {
    Reservations: {
      Instances: {
        InstanceId: string;
        ImageId: string;
        State: { Code: number; Name: string };
        PrivateDnsName?: string;
        PublicDnsName?: string;
        InstanceType: string;
        LaunchTime: string;
        Placement: {
          AvailabilityZone: string;
          GroupName: string;
          Tenancy: string;
        };
        Monitoring: { State: string };
        SubnetId?: string;
        VpcId?: string;
        PrivateIpAddress?: string;
        PublicIpAddress?: string;
        Architecture: string;
        RootDeviceType: string;
        RootDeviceName: string;
        Hypervisor: string;
        EnaSupport: boolean;
        EbsOptimized: boolean;
        ClientToken?: string;
        BlockDeviceMappings?: {
          DeviceName: string;
          Ebs: {
            VolumeId: string;
            Status: string;
            AttachTime: string;
            DeleteOnTermination: boolean;
          };
        }[];
        NetworkInterfaces?: {
          Association?: {
            IpOwnerId?: string;
            PublicDnsName?: string;
            PublicIp?: string;
          };
          Attachment?: {
            AttachTime: string;
            AttachmentId: string;
            DeleteOnTermination: boolean;
            DeviceIndex: number;
            Status: string;
            NetworkCardIndex?: number;
          };
          Description?: string;
          Groups: { GroupId: string; GroupName: string }[];
          Ipv6Addresses?: any[];
          MacAddress: string;
          NetworkInterfaceId: string;
          OwnerId: string;
          PrivateDnsName: string;
          PrivateIpAddress: string;
          PrivateIpAddresses: {
            Association?: {
              IpOwnerId?: string;
              PublicDnsName?: string;
              PublicIp?: string;
            };
            Primary: boolean;
            PrivateDnsName: string;
            PrivateIpAddress: string;
          }[];
          SourceDestCheck: boolean;
          Status: string;
          SubnetId: string;
          VpcId: string;
          InterfaceType: string;
          Operator?: { Managed: boolean };
        }[];
        Tags?: { Key: string; Value: string }[];
      }[];
    }[];
  };
  const result = await aws<DescribeInstance>(
    `aws ec2 describe-instances --instance-ids='${instanceId}'`,
  );
  return result.Reservations[0].Instances[0];
};
