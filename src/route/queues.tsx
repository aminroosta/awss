import {
  awsSqsListQueues,
  awsSqsQueueAttributesYaml,
  awsUrls,
} from "../api";
import { registerRoute } from "./factory/registerRoute";
import { registerYamlRoute } from "./yaml";
import { pushRoute } from "../store";
import { openInBrowser } from "../util/system";

registerRoute({
  id: "queues",
  alias: ["queues", "sqs"],
  args: () => ({}),
  aws: () => awsSqsListQueues(),
  title: () => "sqs queues",
  filter: () => "all",
  columns: [{ title: "Name", render: "name" }],
  keymaps: [
    {
      key: "return",
      name: "Queue attributes",
      fn: (item) => pushRoute({ id: "sqs_queue_yaml", args: { ...item } }),
    },
    {
      key: "a",
      name: "AWS Console",
      fn: async (item) => {
        const url = await awsUrls.queue!(item.url);
        openInBrowser(url);
      },
    },
  ],
});

registerYamlRoute({
  id: "sqs_queue_yaml",
  args: (a: { url: string; name: string }) => a,
  aws: (a) => awsSqsQueueAttributesYaml(a.url),
  title: (a) => a.name,
  url: (a) => awsUrls.queue!(a.url),
});
