import { createEffect, createResource, createSignal } from "solid-js";
import { awsListObjectsV2, awsListObjectsV2Search, awsRegion } from "../aws";
import { Title } from "../ui/title";
import { List } from "../ui/list";
import { modals, popRoute, pushRoute, routes, setModal, revision, setFilterText, filterText, filterVisible } from "../store";
import { log } from "../util/log";
import type { ParsedKey } from "@opentui/core";
import { openInBrowser } from "../util/system";

export const Objects = (p: { args: { bucket: string, prefix: string } }) => {
  const [folderObjects] = createResource(
    () => ({ bucket: p.args.bucket, prefix: p.args.prefix, revision: revision() }),
    ({ bucket, prefix }) => awsListObjectsV2(bucket, prefix),
    {
      initialValue: { Contents: [], CommonPrefixes: [], Prefix: '' }
    }
  );
  const search = () => filterVisible() ? '' : filterText();

  const [searchObjects] = createResource(
    () => ({ bucket: p.args.bucket, prefix: p.args.prefix, search: search(), revision: revision() }),
    ({ bucket, prefix, search }) => awsListObjectsV2Search(bucket, search, prefix),
    { initialValue: [] }
  );
  createEffect(() => {
    log({ searchObjects: searchObjects() });
  });

  const objects = () => search() ? ({
    Contents: searchObjects(),
    CommonPrefixes: [],
    Prefix: p.args.prefix,
  }) : folderObjects();

  const loading = () => {
    return folderObjects.loading || (search() && searchObjects.loading);
  };


  const parentDir = { Key: '.. (up a dir)', LastModified: '', Size: '' };
  const items = () => {
    if (loading()) { return [{ Key: '⏳', LastModified: '', Size: '' }] }

    const contents = (objects().Contents || []).map(c => ({
      Key: c.Key.replace(p.args.prefix, ''),
      LastModified: c.LastModified.split('+')[0]!,
      Size: (c.Size < 1024 ? c.Size + ' B' : c.Size < 1024 * 1024 ? (c.Size / 1024).toFixed(1) + ' KB' : c.Size < 1024 * 1024 * 1024 ? (c.Size / (1024 * 1024)).toFixed(1) + ' MB' : (c.Size / (1024 * 1024 * 1024)).toFixed(1) + ' GB'),
    }));
    const prefixes = (objects().CommonPrefixes || []).map(cp => ({
      Key: cp.Prefix.replace(p.args.prefix, ''),
      LastModified: '',
      Size: '<DIR>',
    }));
    return [parentDir, ...prefixes, ...contents];
  };

  const onEnter = (item: { Key: string, Size: string, LastModified: String }) => {
    if (item.Key === parentDir.Key) {
      popRoute();
    } else if (item.Size === '<DIR>') {
      pushRoute({
        ...routes.Objects,
        args: { bucket: p.args.bucket, prefix: p.args.prefix + item.Key },
      });
    } else {
      setFilterText('');
      pushRoute({
        ...routes.File,
        args: {
          bucket: p.args.bucket,
          key: p.args.prefix + item.Key,
          title: '/' + p.args.prefix + item.Key
        }
      })
    }
  };
  const onKey = async (key: ParsedKey, item: any) => {
    if (!item || item.Key === parentDir.Key) { return; }

    const region = await awsRegion();
    if (key.name === 'a') {
      if (item.Size !== '<DIR>') {
        openInBrowser(`https://${region}.console.aws.amazon.com/s3/object/${p.args.bucket}?region=us-east-2&prefix=${encodeURIComponent(p.args.prefix + item.Key)}`);
      } else {
        openInBrowser(`https://${region}.console.aws.amazon.com/s3/buckets/${p.args.bucket}?region=us-east-2&prefix=${encodeURIComponent(p.args.prefix + item.Key)}&showversions=false`);
      }
    }
  };

  return (
    <box>
      <Title
        title={p.args.bucket}
        filter={(p.args.prefix ? '/' + p.args.prefix : undefined)}
        count={loading() ? '⏳' : items().length}
      />
      <List
        items={items()}
        onEnter={onEnter}
        onKey={onKey}
        columns={[
          { title: 'KEY', render: 'Key' },
          { title: 'SIZE', render: 'Size' },
          { title: 'LAST MODIFIED', render: 'LastModified' },
        ]}
      />
    </box>
  );
};
