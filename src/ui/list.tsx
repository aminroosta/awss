import { bold, dim, getKeyHandler, TextAttributes } from "@opentui/core";
import { createSignal, For, onCleanup, onMount, Show, type Accessor } from "solid-js";
import { colors } from "../util/colors";
import { cmdVisible } from "../store";


export const List = (p: {
  items: any[],
  columns: { title: string, render: any }[],
}) => {
  const [idx, setIdx] = createSignal(-1);
  const keyHandler = getKeyHandler();

  const onKeypress = (key: any) => {
    if (cmdVisible()) return;
    if (['down', 'j'].includes(key.name)) {
      setIdx((i) => Math.min(i + 1, p.items.length - 1));
    } else if (['up', 'k'].includes(key.name)) {
      setIdx((i) => Math.max(i - 1, 0));
    }
  };

  onMount(() => {
    keyHandler.on('keypress', onKeypress);
  });

  onCleanup(() => {
    keyHandler.off('keypress', onKeypress);
  });

  const bgColor = (i: Accessor<number>) => i() == idx() ? colors().primary : colors().background;
  const fgColor = (i: Accessor<number>) => i() == idx() ? colors().invert : colors().foreground;
  const getAttrs = (i: Accessor<number>) => i() == idx() ? TextAttributes.BOLD : TextAttributes.NONE;

  return (
    <box flexDirection="row" paddingLeft={1} paddingRight={1}>
      <For each={p.columns}>
        {(column, colIndex) => (
          <>
            <box>
              <text>{column.title}</text>
              <For each={p.items}>
                {(item, index) => (
                  <box backgroundColor={bgColor(index)}>
                    {
                      <text fg={fgColor(index)} attributes={getAttrs(index)}>{
                        typeof column.render === 'string' ?
                          item[column.render] :
                          column.render(item)
                      }</text>
                    }
                  </box>
                )}
              </For>
            </box>
            <Show when={colIndex() < p.columns.length - 1}>
              <box flexGrow={1} width={2}>
                <text> </text>
                <For each={p.items}>
                  {(item, index) => (
                    <box flexGrow={1} backgroundColor={bgColor(index)} />
                  )}
                </For>
              </box>
            </Show>
          </>
        )}
      </For>
    </box>
  );
}
