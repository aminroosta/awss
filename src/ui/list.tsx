import { bold, dim, getKeyHandler, TextAttributes } from "@opentui/core";
import { batch, createEffect, createSignal, For, Index, onCleanup, onMount, Show, type Accessor } from "solid-js";
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

  const terminalDim = useTerminalDimensions()
  const height = () => {
    let { height } = terminalDim();
    const borderY = 2, titleHeight = 1;
    return height - constants.HEADER_HEIGHT
      - borderY - titleHeight
      - (cmdVisible() ? constants.CMDLINE_HEIGHT : 0)
  };

  const setIndex = (i: number) => {
    setIdx(i);
    if (i < visIdx()) {
      setVisIdx(i);
    } else if (i >= visIdx() + height()) {
      setVisIdx(i - height() + 1);
    }
  }

  const [last_g, setLast_g] = createSignal(0);
  useKeyHandler(key => {
    if (cmdVisible()) return;
    if (!p.isModal && modal()) return;

    batch(() => {
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
  });

  const visibleItems = () => {
    const start = Math.max(visIdx(), 0)
    return p.items.slice(start, start + height()).map((item, i) => ({
      item,
      props: {
        bg: (i + start) === idx() ? colors().main.v200 : colors().bg,
        fg: (i + start) === idx() ? colors().main.v950 : colors().fg,
        attrs: (i + start) === idx() ? TextAttributes.BOLD : TextAttributes.NONE,
      }
    }));
  };

  const columns = () => p.columns.map(c => ({
    title: c.title,
    render: typeof c.render === 'string' ?
      (item: any, props: any) => <text {...props}>{item[c.render]} </text> :
      c.render
  }));

  return (
    <box
      border borderColor={colors().main.v500}
      flexDirection="row" flexGrow={1}
      paddingLeft={1} paddingRight={1}
    >
      <Index each={columns()}>
        {(column, colIndex) => (
          <>
            <box>
              <text fg={colors().fg}>{column().title}</text>
              <Index each={visibleItems()}>
                {(vitem) => (
                  <box backgroundColor={vitem().props.bg}>
                    {
                      column().render(vitem().item, vitem().props)
                    }
                  </box>
                )}
              </Index>
            </box>
            <box flexGrow={colIndex < p.columns.length - 1 ? 1 : 0} width={2}>
              <text fg={colors().fg}> </text>
              <Index each={visibleItems()}>
                {(vitem) => (
                  <box flexBasis={1} backgroundColor={vitem().props.bg}></box>
                )}
              </Index>
            </box>
          </>
        )}
      </Index>
    </box>
  );
}
