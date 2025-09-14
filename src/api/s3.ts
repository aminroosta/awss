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
