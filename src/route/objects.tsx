import { awsListObjectsV2, awsListObjectsV2Search, awsRegion } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { popRoute, pushRoute, routes, setFilterText } from "../store";
import type { ParsedKey } from "@opentui/core";
import { openInBrowser } from "../util/system";

registerRoute({
  id: 'objects',
  alias: [],
  actions: [
    { key: 'r', name: 'Refresh' },
    { key: 'a', name: 'Aws Website' },
    { key: 'enter', name: 'Open' },
  ],
  filterPlaceholder: 'Press <Enter> to include objects in all subdirectories',
  args: (a: { bucket: string, prefix: string }) => a,
  aws: async ({ bucket, prefix, search }) => {
    const data = search ? await awsListObjectsV2Search(bucket, search, prefix) : await awsListObjectsV2(bucket, prefix);
    const contents = (Array.isArray(data) ? data : (data.Contents || [])).map(c => ({
      Key: c.Key.replace(prefix, ''),
      LastModified: c.LastModified.split('+')[0]!,
      Size: (c.Size < 1024 ? c.Size + ' B' : c.Size < 1024 * 1024 ? (c.Size / 1024).toFixed(1) + ' KB' : c.Size < 1024 * 1024 * 1024 ? (c.Size / (1024 * 1024)).toFixed(1) + ' MB' : (c.Size / (1024 * 1024 * 1024)).toFixed(1) + ' GB'),
    }));
    const prefixes = (data.CommonPrefixes || []).map(cp => ({
      Key: cp.Prefix.replace(prefix, ''),
      LastModified: '',
      Size: '<DIR>',
    }));
    const parentDir = { Key: '.. (up a dir)', LastModified: '', Size: '' };
    return [parentDir, ...prefixes, ...contents];
  },
  title: (args) => args.bucket,
  filter: (args) => args.prefix ? '/' + args.prefix : undefined,
  columns: [
    { title: 'KEY', render: 'Key' },
    { title: 'SIZE', render: 'Size' },
    { title: 'LAST MODIFIED', render: 'LastModified' },
  ],
  onEnter: (item, args) => {
    if (item.Key === '.. (up a dir)') {
      popRoute();
    } else if (item.Size === '<DIR>') {
      pushRoute({
        id: 'objects',
        args: { bucket: args.bucket, prefix: args.prefix + item.Key },
      });
    } else {
      setFilterText('');
      pushRoute({
        id: 'file',
        args: {
          bucket: args.bucket,
          key: args.prefix + item.Key,
          title: '/' + args.prefix + item.Key
        }
      });
    }
  },
  onKey: async (key, item, args) => {
    if (!item || item.Key === '.. (up a dir)') { return; }
    const region = await awsRegion();
    if (key.name === 'a') {
      if (item.Size !== '<DIR>') {
        openInBrowser(`https://${region}.console.aws.amazon.com/s3/object/${args.bucket}?region=us-east-2&prefix=${encodeURIComponent(args.prefix + item.Key)}`);
      } else {
        openInBrowser(`https://${region}.console.aws.amazon.com/s3/buckets/${args.bucket}?region=us-east-2&prefix=${encodeURIComponent(args.prefix + item.Key)}&showversions=false`);
      }
    }
  },
});
