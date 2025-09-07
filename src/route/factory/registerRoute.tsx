import type { ParsedKey, RGBA } from "@opentui/core";
import { createResource, createSignal } from "solid-js";
import { revision, searchText, searchVisible } from "../../store";
import { Title } from "../../ui/title";
import { List } from "../../ui/list";
import { log } from "../../util/log";

export const routes = {} as Record<string, {
  component: Function;
  id: string;
  alias: string[];
  keymaps: {
    key: string | Partial<ParsedKey>;
    name: string;
    when?: (item: any, props: any) => boolean;
    fn: (item: any, args: any) => any
  }[]
  searchPlaceholder?: string;
}>;

export const registerRoute = <R, A, T extends Record<string, string>>(r: {
  id: string;
  alias: string[];
  keymaps: {
    key: string | Partial<ParsedKey>;
    name: string;
    when?: (item: T, args: A) => boolean;
    fn: (item: T, args: A) => any
  }[]
  searchPlaceholder?: string;
  args: (_: A) => A;
  aws: (_: A & { revision: number; search?: string }) => Promise<T[]>;
  title: (_: A) => string;
  filter?: (_: A) => string | undefined;
   columns: {
     title: string,
     render: keyof T,
     attrs?: (item: T) => number,
     syn?: (snippet: string) => Partial<{fg: RGBA, bg: RGBA, attrs: number}>,
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
          onKey={(key, item) => {
            const keymap = r.keymaps.find(km => {
              if (typeof km.key === 'string') {
                return km.key === key.name
              } else {
                return Object.entries(km.key).every(([k, v]) => (key as any)[k] === v);
              }
            });
            if (keymap && (!keymap.when || keymap.when(item, p.args))) {
              keymap.fn(item, p.args);
            }
          }}
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

  return <Component args={p.route.args} />
}
