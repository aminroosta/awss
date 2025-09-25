import { aws } from "./aws";

export const awsSqsListQueues = async () => {
  type ListQueuesResponse = {
    QueueUrls?: string[];
  };
  const data = await aws<ListQueuesResponse>("aws sqs list-queues");
  return (data.QueueUrls || []).map((url) => ({
    name: url.split("/").pop()!,
    url: url,
  }));
};

export const awsSqsQueueAttributesYaml = (queueUrl: string) =>
  aws(
    `aws sqs get-queue-attributes --queue-url='${queueUrl}' --attribute-names All`,
    "yaml",
  );
