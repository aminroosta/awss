import type { ParsedKey } from "@opentui/core";
import { createResource, createSignal } from "solid-js";
import { revision, searchText, searchVisible } from "../../store";
import { Title } from "../../ui/title";
import { List } from "../../ui/list";
import { log } from "../../util/log";

export const routes = {} as Record<string, {
  component: Function;
  id: string;
  alias: string[];
  actions: { key: string; name: string; }[]
  searchPlaceholder?: string;
  onEnter?: Function;
  onKey: Function;
}>;

export const registerRoute = <R, A, T extends Record<string, string>>(r: {
  id: string;
  alias: string[];
  actions: { key: string; name: string; }[]
  searchPlaceholder?: string;
  args: (_: A) => A;
  aws: (_: A & { revision: number; search?: string }) => Promise<T[]>;
  title: (_: A) => string;
  filter?: (_: A) => string | undefined;
  onEnter?: (item: T, args: A) => any;
  onKey: (key: ParsedKey, item: T, args: A) => any;
  columns: {
    title: string,
    render: keyof T,
    attrs?: (item: T) => number,
  }[],
}) => {

  const Route = (p: { args: A }) => {
    const initialValue = [Object.fromEntries(r.columns.map((c, i) => [c.render, i === 0 ? '⏳' : ''])) as T];
    const [resource] = createResource(
      () => ({ ...r.args(p.args), revision: revision(), search: searchVisible() ? '' : searchText() }),
      async (a) => r.aws(a)
    );

    return (
      <box flexGrow={1}>
        <Title
          title={r.title(p.args)}
          filter={r.filter?.(p.args)}
          count={resource.loading ? '⏳' : resource()!.length + ''}
        />
        <List
          items={resource.loading ? initialValue : resource()!}
          columns={r.columns}
          onEnter={(item) => r.onEnter?.(item, p.args)}
          onKey={(key, item) => r.onKey(key, item, p.args)}
        />
      </box>
    );
  };

  routes[r.id] = {
    component: Route,
    ...r
  };
};


export const RenderRoute = (p: { route: { args: any, id: string } }) => {
  let Component = routes[p.route.id]!.component
  log({ r: p.route });

  return <Component args={p.route.args} />
}
