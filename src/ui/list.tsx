import { bold, dim, getKeyHandler, TextAttributes } from "@opentui/core";
import { createEffect, createSignal, For, onCleanup, onMount, Show, type Accessor } from "solid-js";
import { colors } from "../util/colors";
import { cmdVisible, constants, modal } from "../store";
import { useKeyHandler, useTerminalDimensions } from "@opentui/solid";


export const List = (p: {
  items: any[],
  onEnter: (item: any) => void,
  columns: { title: string, render: any }[],
  isModal?: boolean
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
  useKeyHandler(key => {
    if (cmdVisible()) return;
    if (!p.isModal && modal()) return;

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
    } else if (key.name === 'return') {
      if (i >= 0) {
        p.onEnter(p.items[i]);
      }
    }
  });

  const bgColor = (i: Accessor<number>) => i() == idx() ? colors().main.v200 : colors().bg;
  const fgColor = (i: Accessor<number>) => i() == idx() ? colors().main.v950 : colors().fg;
  const getAttrs = (i: Accessor<number>) => i() == idx() ? TextAttributes.BOLD : TextAttributes.NONE;
  const isVisible = (index: Accessor<number>) => {
    return index() >= visIdx() && index() < visIdx() + height();
  };

  const render = (index: Accessor<number>, item: any, column: { title: string, render: any }) => {
    const props = { fg: fgColor(index), attributes: getAttrs(index) };
    const value = typeof column.render === 'string' ?
      item[column.render] :
      column.render(item, props);

    if (typeof value === 'string') {
      return (<text {...props}>{value} </text>);
    }
    return value;
  }

  return (
    <box
      border borderColor={colors().main.v500}
      flexDirection="row" flexGrow={1}
      paddingLeft={1} paddingRight={1}
    >
      <For each={p.columns}>
        {(column, colIndex) => (
          <>
            <box>
              <text fg={colors().fg}>{column.title}</text>
              <For each={p.items}>
                {(item, index) => (
                  <box visible={isVisible(index)} backgroundColor={bgColor(index)}>
                    {render(index, item, column)}
                  </box>
                )}
              </For>
            </box>
            <box visible={colIndex() < p.columns.length - 1} flexGrow={1} width={2}>
              <text fg={colors().fg}> </text>
              <For each={p.items}>
                {(item, index) => (
                  <box visible={isVisible(index)} flexBasis={1} backgroundColor={bgColor(index)}></box>
                )}
              </For>
            </box>
          </>
        )}
      </For>
    </box>
  );
}
