import { aws } from "./aws";

export const awsListBuckets = async () => {
  type ListBuckets = {
    Buckets: { Name: string; CreationDate: string }[];
    Owner: { DisplayName: string; ID: string };
  };
  const result = await aws<ListBuckets>("aws s3api list-buckets");
  const maxLen = Math.max(...result.Buckets.map((b) => b.Name.length));
  for (let bucket of result.Buckets) {
    bucket.Name = bucket.Name.padEnd(maxLen, " ");
    bucket.CreationDate = bucket.CreationDate.split("T")[0]!;
  }
  return result;
};

export const awsListObjectsV2 = async (
  bucket: string,
  prefix: string,
  delimiter = "/",
) => {
  type R = {
    Contents: {
      Key: string;
      LastModified: string;
      Size: number;
      StorageClass: string;
      ETag: string;
      ChecksumType: string;
      ChecksumAlgorithm: string[];
    }[];
    CommonPrefixes?: { Prefix: string }[];
    Prefix?: string;
  };
  return await aws<R>(
    `aws s3api list-objects-v2 --bucket='${bucket}' --delimiter='${delimiter}' --prefix='${prefix}'`,
  );
};

export const awsListObjectsV2Search = async (
  bucket: string,
  search: string,
  prefix: string = "",
  continuationToken: string | undefined = undefined,
  maxKeys: number = 1000,
) => {
  if (!search.trim()) {
    return { Contents: [] };
  }
  const words = search.trim().split(/\s+/);
  const queryFilter = words.map((w) => `contains(Key, '${w}')`).join(" || ");
  type Result = {
    Objects: {
      Key: string;
      LastModified: string;
      Size: number;
      StorageClass: string;
    }[];
    NextToken?: string;
  };
  try {
    const command = continuationToken
      ? `aws s3api list-objects-v2 --bucket='${bucket}' --prefix='${prefix}' --max-keys=${maxKeys} --query "{Objects: Contents[?${queryFilter}], NextToken: NextContinuationToken}" --continuation-token='${continuationToken}' --output=json`
      : `aws s3api list-objects-v2 --bucket='${bucket}' --prefix='${prefix}' --max-keys=${maxKeys} --query "{Objects: Contents[?${queryFilter}], NextToken: NextContinuationToken}" --output=json`;
    const result = await aws<Result>(command);
    return { Contents: result.Objects, NextToken: result.NextToken };
  } catch (e: any) {
    e.command = continuationToken
      ? `aws s3api list-objects-v2 --bucket='${bucket}' --prefix='${prefix}' --max-keys=${maxKeys} --query "{Objects: Contents[?${queryFilter}], NextToken: NextContinuationToken}" --continuation-token='${continuationToken}' --output=json`
      : `aws s3api list-objects-v2 --bucket='${bucket}' --prefix='${prefix}' --max-keys=${maxKeys} --query "{Objects: Contents[?${queryFilter}], NextToken: NextContinuationToken}" --output=json`;
    throw e;
  }
};
