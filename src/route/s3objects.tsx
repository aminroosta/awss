import { createResource } from "solid-js";
import { awsListObjectsV2 } from "../aws";
import { Title } from "../ui/title";
import { List } from "../ui/list";
import { modals, popRoute, pushRoute, routes, setModal, revision, setFilterText } from "../store";

export const S3Objects = (p: { args: { bucket: string, prefix: string } }) => {
  const [objects] = createResource(
    () => ({ bucket: p.args.bucket, prefix: p.args.prefix, revision: revision() }),
    ({ bucket, prefix }) => awsListObjectsV2(bucket, prefix),
    {
      initialValue: { Contents: [], CommonPrefixes: [], Prefix: '' }
    }
  );

  const parentDir = { Key: '.. (up a dir)', LastModified: '', Size: '' };
  const items = () => {
    if (objects.loading) { return [{ Key: '⏳', LastModified: '', Size: '' }] }

    const contents = (objects().Contents || []).map(c => ({
      Key: c.Key.replace(p.args.prefix, ''),
      LastModified: c.LastModified.split('+')[0],
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

  return (
    <box>
      <Title
        title={p.args.bucket}
        filter={(p.args.prefix ? '/' + p.args.prefix : undefined)}
        count={objects.loading ? '⏳' : items().length}
      />
      <List
        items={items()}
        onEnter={onEnter}
        columns={[
          { title: 'KEY', render: 'Key' },
          { title: 'SIZE', render: 'Size' },
          { title: 'LAST MODIFIED', render: 'LastModified' },
        ]}
      />
    </box>
  );
};
