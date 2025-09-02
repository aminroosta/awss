import { bold, dim, getKeyHandler, TextAttributes } from "@opentui/core";
import { batch, createMemo, createSignal, For, type Accessor } from "solid-js";
import { colors } from "../util/colors";
import { cmdVisible, constants, modal, filterVisible, filterText, setFilterText } from "../store";
import { useKeyHandler, useTerminalDimensions } from "@opentui/solid";
import { log } from "../util/log";


export const List = (p: {
  items: any[],
  onEnter: (item: any) => void,
  columns: { title: string, render: any }[],
  isModal?: boolean
}) => {
  const [idx, setIdx] = createSignal(-1);
  const [visIdx, setVisIdx] = createSignal(0);

  const query = () => {
    if (!!p.isModal === !!modal()) { return filterText(); }
    return '';
  };

  const filtered = createMemo(() => {
    const q = (query() || '').trim().toLowerCase();
    if (!q) return p.items;
    const getColVal = (item: any, column: { title: string; render: any }): string => {
      const v = typeof column.render === 'string' ? item[column.render] : column.render(item, {});
      return typeof v === 'string' ? v : (v?.toString?.() ?? '');
    };
    return p.items.filter(it => p.columns.some(col => getColVal(it, col)?.toLowerCase().includes(q)));
  });

  const setIndex = (i: number) => {
    const max = Math.max(filtered().length - 1, -1);
    const clamped = Math.max(Math.min(i, max), max >= 0 ? 0 : -1);
    setIdx(clamped);
    if (clamped < visIdx()) {
      setVisIdx(clamped);
    } else if (clamped >= visIdx() + height()) {
      setVisIdx(clamped - height() + 1);
    }
  }

  const terminalDim = useTerminalDimensions()
  const height = createMemo(() => {
    let { height } = terminalDim();
    const borderY = 2, titleHeight = 1;
    return height - constants.HEADER_HEIGHT
      - borderY - titleHeight
      - (cmdVisible() ? constants.CMDLINE_HEIGHT : 0)
      - (filterVisible() ? constants.CMDLINE_HEIGHT : 0)
  });

  const [last_g, setLast_g] = createSignal(0);
  useKeyHandler(key => {
    if (cmdVisible()) return;
    if (!p.isModal && modal()) return;

    const i = idx();
    if (["down", "j"].includes(key.name)) {
      setIndex(Math.min(i + 1, filtered().length - 1));
    } else if (["up", "k"].includes(key.name)) {
      setIndex(Math.max(i - 1, 0));
    } else if (key.name === 'g' && !key.shift) {
      const now = +new Date();
      if (now - last_g() < 500) {
        setIndex(0);
      }
      setLast_g(now);
    } else if (key.name === 'g' && key.shift) {
      setIndex(filtered().length - 1);
    } else if (key.name === 'return') {
      if (i >= 0 && !cmdVisible() && !filterVisible()) {
        let route = filtered()[i];
        setFilterText('');
        p.onEnter(route);
      }
    }
  });

  const bgColor = (i: number) => i === idx() ? colors().main.v200 : colors().bg;
  const fgColor = (i: number) => i === idx() ? colors().main.v950 : colors().fg;
  const getAttrs = (i: number) => i === idx() ? TextAttributes.BOLD : TextAttributes.NONE;

  const visibleStart = createMemo(() => visIdx());
  const visibleEnd = createMemo(() => Math.min(visibleStart() + height(), filtered().length));
  const visibleItems = createMemo(() => filtered().slice(visibleStart(), visibleEnd()));

  // Highlight matches within text values
  const highlight = (text: string, props: any) => {
    const q = (query() || '').trim();
    let pre = text, mid = '', post = '';
    if (q) {
      const idx = text.toLowerCase().indexOf(q.toLowerCase());
      if (idx !== -1) {
        pre = text.slice(0, idx);
        mid = text.slice(idx, idx + q.length);
        post = text.slice(idx + q.length);
      }
    }

    return (
      <box flexDirection="row">
        <text {...props}>{pre}</text>
        <text visible={!!mid} fg={colors().main.v600} bg={colors().main.v100} attributes={TextAttributes.BOLD}>{mid}</text>
        <text visible={!!post} {...props}>{post}</text>
      </box>
    );
  };

  const render = (index: Accessor<number>, item: any, column: { title: string, render: any }) => {
    const i = index();
    const props = { fg: fgColor(i), attributes: getAttrs(i) };
    const value = typeof column.render === 'string' ?
      item[column.render] :
      column.render(item, props);

    if (typeof value === 'string') {
      return highlight(value, props);
    }
    return <box>{value}</box>;
  }

  return (
    <box
      title={query() ? ' /' + query() + ' ' : ''}
      titleAlignment="right"
      border borderColor={colors().main.v500}
      flexDirection="row" flexGrow={1}
      paddingLeft={1} paddingRight={1}
    >
      <For each={p.columns}>
        {(column, colIndex) => (
          <>
            <box>
              <text fg={colors().fg}>{column.title}</text>
              <For each={visibleItems()}>
                {(item, i) => {
                  const index = () => i() + visibleStart();
                  return (
                    <box backgroundColor={bgColor(index())}>
                      {render(() => index(), item, column)}
                    </box>
                  );
                }}
              </For>
            </box>
            <box visible={colIndex() < p.columns.length - 1} flexGrow={1} width={2}>
              <text fg={colors().fg}> </text>
              <For each={visibleItems()}>
                {(_, i) => (
                  <box flexBasis={1} backgroundColor={bgColor(i() + visibleStart())}></box>
                )}
              </For>
            </box>
          </>
        )}
      </For>
    </box>
  );
}
