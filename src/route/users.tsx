import { awsIamListUsers, awsRegion, awsUrls } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import type { ParsedKey } from "@opentui/core";

registerRoute({
  id: "users",
  alias: ["users"],
  args: () => ({}),
  aws: async () => {
    const data = await awsIamListUsers();
    return data.map((u) => ({
      ...u,
      CreateDate: u.CreateDate?.split("T")[0],
    }));
  },
  title: () => "users",
  filter: () => "all",
  columns: [
    { title: "USER NAME", render: "UserName" },
    { title: "USER ID", render: "UserId" },
    { title: "ARN", render: "Arn" },
    { title: "CREATED", render: "CreateDate" },
  ],
  keymaps: [
    {
      key: "a",
      name: "AWS Website",
      fn: async (item, _args) => {
        const url = await awsUrls.users(item.UserName);
        openInBrowser(url);
      },
    },
  ],
});
