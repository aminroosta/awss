import type { ParsedKey } from "@opentui/core";
import { createResource, createSignal } from "solid-js";
import { revision } from "../../store";
import { Title } from "../../ui/title";
import { List } from "../../ui/list";

export const routes = {} as Record<string, {
  component: Function;
  id: string;
  alias: string[];
  actions: { key: string; name: string; }[]
  filterPlaceholder?: string;
}>;

export const registerRoute = <R, A, T extends Record<string, string>>(r: {
  id: string;
  alias: string[];
  actions: { key: string; name: string; }[]
  filterPlaceholder?: string;
  args: (_: A) => A;
  aws: (_: A) => Promise<T[]>;
  title: (_: A) => string;
  onKey: (key: ParsedKey, item: T) => any;
  columns: {
    title: string,
    render: keyof T,
    attrs?: (item: T) => number,
  }[],
}) => {

  const Route = (p: { args: A }) => {
    const initialValue = [Object.fromEntries(r.columns.map((c, i) => [c.render, i === 0 ? '⏳' : ''])) as T];
    const [resource] = createResource(
      () => ({ ...r.args(p.args), revision: revision() }),
      async (a: A) => r.aws(a)
    );

    return (
      <box flexGrow={1}>
        <Title
          title={r.title(p.args)}
          count={resource.loading ? '⏳' : resource().length + ' lines'}
        />
        <List
          items={resource.loading ? initialValue : resource()}
          columns={r.columns}
          onEnter={() => { }}
          onKey={r.onKey}
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
