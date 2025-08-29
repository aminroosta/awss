import { bold, dim } from "@opentui/core";
import { For } from "solid-js";


export const List = (p: {
  items: any[],
  columns: { title: string, render: any }[],
}) => {
  return (
    <box columnGap={2} flexDirection="row" justifyContent="space-between" paddingLeft={1} paddingRight={1}>
      <For each={p.columns}>
        {(column) => (
          <box>
            <text>{bold(column.title)}</text>
            <For each={p.items}>
              {(item) => (
                <box>
                  {
                    typeof column.render === 'string' ?
                      <text>{dim(item[column.render])}</text> :
                      column.render(item)
                  }
                </box>
              )}
            </For>
          </box>
        )}
      </For>
    </box>
  );
}
