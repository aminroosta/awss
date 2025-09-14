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

export async function awsEc2DescribeSubnet(subnetId: string) {
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
}

export function awsEc2DescribeSubnetYaml(subnetId: string) {
  return aws(`aws ec2 describe-subnets --subnet-ids='${subnetId}'`, "yaml");
}
