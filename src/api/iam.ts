import { aws } from "./aws";

export const awsIamListUsers = async () => {
  type ListUsers = {
    Users: {
      Path: string;
      UserName: string;
      UserId: string;
      Arn: string;
      CreateDate: string;
      Tags?: { Key: string; Value: string }[];
    }[];
  };
  const result = await aws<ListUsers>(`aws iam list-users`);
  return result.Users;
};

