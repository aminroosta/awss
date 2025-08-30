import { bold, dim, getKeyHandler, TextAttributes } from "@opentui/core";
import { createEffect, createSignal, For, onCleanup, onMount, Show, type Accessor } from "solid-js";
import { colors } from "../util/colors";
import { cmdVisible, constants } from "../store";
import { useTerminalDimensions } from "@opentui/solid";


export const List = (p: {
  items: any[],
  columns: { title: string, render: any }[],
}) => {
  const [idx, setIdx] = createSignal(-1);
  const [visIdx, setVisIdx] = createSignal(0);

  const setIndex = (i: number) => {
    setIdx(i);
    if (i < visIdx()) {
      setVisIdx(i);
    } else if (i >= visIdx() + height()) {
      setVisIdx(i - height() + 1);
    }
  }


  const terminalDim = useTerminalDimensions()
  const height = () => {
    let { height } = terminalDim();
    const borderY = 2, titleHeight = 1;
    return height - constants.HEADER_HEIGHT
      - borderY - titleHeight
      - (cmdVisible() ? constants.CMDLINE_HEIGHT : 0)
  };

  const [last_g, setLast_g] = createSignal(0);
  const onKeypress = (key: any) => {
    if (cmdVisible()) return;
    const i = idx();
    if (['down', 'j'].includes(key.name)) {
      setIndex(Math.min(i + 1, p.items.length - 1));
    } else if (['up', 'k'].includes(key.name)) {
      setIndex(Math.max(i - 1, 0));
    } else if (key.name === 'g' && !key.shift) {
      const now = +new Date();
      if (now - last_g() < 500) {
        setIndex(0);
      }
      setLast_g(now);
    } else if (key.name === 'g' && key.shift) {
      setIndex(p.items.length - 1);
    }
  };

  const keyHandler = getKeyHandler();
  onMount(() => { keyHandler.on('keypress', onKeypress); });
  onCleanup(() => { keyHandler.off('keypress', onKeypress); });

  const bgColor = (i: Accessor<number>) => i() == idx() ? colors().primary : colors().background;
  const fgColor = (i: Accessor<number>) => i() == idx() ? colors().invert : colors().foreground;
  const getAttrs = (i: Accessor<number>) => i() == idx() ? TextAttributes.BOLD : TextAttributes.NONE;
  const isVisible = (index: Accessor<number>) => {
    return index() >= visIdx() && index() < visIdx() + height();
  };

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
              <text>{column.title}</text>
              <For each={p.items}>
                {(item, index) => (
                  <box visible={isVisible(index)} backgroundColor={bgColor(index)}>
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
                  <box visible={isVisible(index)} flexGrow={1} backgroundColor={bgColor(index)}></box>
                )}
              </For>
            </box>
          </>
        )}
      </For>
    </box>
  );
}
