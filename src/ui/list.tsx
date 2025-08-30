import { bold, dim, getKeyHandler, TextAttributes } from "@opentui/core";
import { createSignal, For, onCleanup, onMount, Show, type Accessor } from "solid-js";
import { colors } from "../util/colors";
import { cmdVisible, constants } from "../store";
import { useTerminalDimensions } from "@opentui/solid";


export const List = (p: {
  items: any[],
  columns: { title: string, render: any }[],
}) => {
  const [idx, setIdx] = createSignal(-1);
  const keyHandler = getKeyHandler();
  const terminalDim = useTerminalDimensions()
  const height = () => {
    let { height } = terminalDim();
    const borderTop = 1, titleHeight = 1;
    return height - constants.HEADER_HEIGHT
      - borderTop - titleHeight
      - (cmdVisible() ? constants.CMDLINE_HEIGHT : 0)
  };
  const [last_g, setLast_g] = createSignal(0);

  const onKeypress = (key: any) => {
    if (cmdVisible()) return;
    if (['down', 'j'].includes(key.name)) {
      setIdx((i) => Math.min(i + 1, p.items.length - 1));
    } else if (['up', 'k'].includes(key.name)) {
      setIdx((i) => Math.max(i - 1, 0));
    } else if (key.name === 'g' && !key.shift) {
      const now = +new Date();
      if (now - last_g() < 500) {
        setIdx(0);
      }
      setLast_g(now);
    } else if (key.name === 'g' && key.shift) {
      setIdx(p.items.length - 1);
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
    <box
      title='heello' titleAlignment="center"
      border borderColor={colors().border}
      flexDirection="row" flexGrow={1}
      paddingLeft={1} paddingRight={1}
    >
      <For each={p.columns}>
        {(column, colIndex) => (
          <>
            <box>
              <text>{column.title} {height()}</text>
              <For each={p.items}>
                {(item, index) => (
                  <box visible={index() + height() > idx()} backgroundColor={bgColor(index)}>
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
            <box visible={colIndex() < p.columns.length - 1} flexGrow={1} width={2}>
              <text> </text>
              <For each={p.items}>
                {(item, index) => (
                  <box visible={index() + height() > idx()} flexGrow={1} backgroundColor={bgColor(index)}></box>
                )}
              </For>
            </box>
          </>
        )}
      </For>
    </box>
  );
}
