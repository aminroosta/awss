import { awsEc2DescribeSecurityGroup, awsRegion } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser, copyToClipboard } from "../util/system";
import { colors } from "../util/colors";
import { TextAttributes } from "@opentui/core";

registerRoute({
  id: 'securitygroup',
  alias: [],
  args: (a: { GroupId: string }) => a,
  aws: async ({ GroupId }) => {
    const content = await awsEc2DescribeSecurityGroup(GroupId, 'yaml');
    return (content as string).split('\n').map((line, idx) => ({ line }));
  },
  title: (args) => `Security Group: ${args.GroupId}`,
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
        openInBrowser(`https://console.aws.amazon.com/ec2/v2/home?region=${region}#SecurityGroups:groupId=${args.GroupId}`);
      }
    },
    {
      key: 'y',
      name: 'Copy YAML',
      fn: async (item, args) => {
        const content = await awsEc2DescribeSecurityGroup(args.GroupId, 'yaml');
        copyToClipboard(content as string);
      }
    },
  ],
});
