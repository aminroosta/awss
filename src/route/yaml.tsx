import { registerRoute } from "./factory/registerRoute";
import { openInBrowser, copyToClipboard } from "../util/system";
import { colors } from "../util/colors";
import { TextAttributes } from "@opentui/core";
import { awsRegion } from "../aws";

export function createYamlRoute<A extends Record<string, string>>({
  id,
  args,
  aws: awsFunction,
  title,
  url,
}: {
  id: string;
  args: (a: A) => A,
  aws: (args: A) => Promise<string>;
  title: (args: A) => string;
  url: (region: string, args: A) => string;
}) {
  registerRoute({
    id,
    alias: [],
    args: args,
    aws: async (args: A) => {
      const content = await awsFunction(args);
      return content.split('\n').map((line, idx) => ({ line }));
    },
    title: title,
    filter: () => 'all',
    columns: [
      {
        title: '',
        render: 'line',
        syn: (snippet: string) => {
          if (snippet === '-') return { fg: colors().accent.v500 };
          if (snippet.endsWith(':')) return { fg: colors().accent.v800, attrs: TextAttributes.BOLD };
          if (/^\d/.test(snippet) || /^["']/.test(snippet)) return { fg: colors().accent.v700 };
          return {};
        }
      },
    ],
    keymaps: [
      {
        key: 'a',
        name: 'AWS Website',
        fn: async (item, args: A) => {
          const region = await awsRegion();
          openInBrowser(url(region, args));
        }
      },
      {
        key: 'y',
        name: 'Copy YAML',
        fn: async (item, args: A) => {
          const content = await awsFunction(args);
          copyToClipboard(content);
        }
      },
    ],
  });
}
