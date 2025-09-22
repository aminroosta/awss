import { registerRoute } from "./factory/registerRoute";
import { openInBrowser, copyToClipboard } from "../util/system";
import { colors } from "../util/colors";
import { TextAttributes } from "@opentui/core";
import { awsRegion } from "../api";
import { setNotification } from "../store";
import { openInVim } from "../util/tmux";

export function registerYamlRoute<A extends Record<string, string>>({
  id,
  args,
  aws: awsFunction,
  title,
  url,
}: {
  id: string;
  args: (a: A) => A;
  aws: (args: A) => Promise<string>;
  title: (args: A) => string;
  url: (args: A) => Promise<string>;
}) {
  registerRoute({
    id,
    alias: [],
    args: args,
    aws: async (args: A) => {
      const content = await awsFunction(args);
      return content.split("\n").map((line, idx) => ({ line }));
    },
    title: title,
    filter: () => "all",
    columns: [
      {
        title: "",
        render: "line",
        syn: (snippet: string) => {
          if (snippet === "-") return { fg: colors().accent.v500 };
          if (snippet.endsWith(":"))
            return { fg: colors().accent.v800, attrs: TextAttributes.BOLD };
          if (/^\d/.test(snippet) || /^["']/.test(snippet))
            return { fg: colors().accent.v700 };
          return {};
        },
      },
    ],
    keymaps: [
      {
        key: "y",
        name: "Copy YAML",
        when: () => true,
        fn: async (_, args: A) => {
          const content = await awsFunction(args);
          copyToClipboard(content);
        },
      },
      {
        key: "a",
        when: () => true,
        name: "AWS Website",
        fn: (_, args: A) => url(args).then(openInBrowser),
      },
      {
        key: "n",
        name: "Open in nvim",
        when: () => true,
        fn: async (_, args: A) => {
          setNotification({
            level: "info",
            message: "Opening in neovim …",
            timeout: 1500,
          });
          const content = await awsFunction(args);
          setNotification(null as any);
          await openInVim(content, title(args) + ".yaml");
        },
      },
    ],
  });
}
