import { awsEc2DescribeVpc, awsRegion } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser, copyToClipboard } from "../util/system";
import { colors } from "../util/colors";
import { TextAttributes, type ParsedKey } from "@opentui/core";

registerRoute({
  id: 'vpc',
  alias: [],
  args: (a: { VpcId: string }) => a,
  aws: async ({ VpcId }) => {
    const content = await awsEc2DescribeVpc(VpcId);
    return content.split('\n').map((line, idx) => ({ line }));
  },
  title: (args) => `VPC: ${args.VpcId}`,
  filter: () => 'all',
  columns: [
    {
      title: '', render: 'line', syn: (snippet: string) => {
        if (snippet === '-') return { fg: colors().accent.v500 };
        if (snippet.endsWith(':')) return { fg: colors().accent.v700, attrs: TextAttributes.BOLD };
        if (/^\d/.test(snippet) || /^["']/.test(snippet)) return { fg: colors().accent.v600 };
        return {};
      }
    },
  ],
  keymaps: [
    {
      key: 'a',
      name: 'AWS Website',
      fn: async (item, args) => {
        const region = await awsRegion();
        openInBrowser(`https://console.aws.amazon.com/vpcconsole/home?region=${region}#VpcDetails:VpcId=${args.VpcId}`);
      }
    },
    {
      key: 'y',
      name: 'Copy YAML',
      fn: async (item, args) => {
        const content = await awsEc2DescribeVpc(args.VpcId);
        copyToClipboard(content);
      }
    },
  ],
});
