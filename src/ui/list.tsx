import { RGBA, TextAttributes, type ParsedKey } from "@opentui/core";
import {
  batch,
  createEffect,
  createMemo,
  createSignal,
  For,
  Index,
} from "solid-js";
import { colors } from "../util/colors";
import {
  cmdVisible,
  constants,
  searchText,
  searchVisible,
  vimVisible,
  route,
} from "../store";
import { useKeyHandler, useTerminalDimensions } from "@opentui/solid";
import { log } from "../util/log";

export const List = <T extends Record<string, string>>(p: {
  items: T[];
  onKey?: (key: ParsedKey, item: T) => any;
  columns: {
    title: string;
    render: keyof T;
    attrs?: (item: T) => number;
    syn?: (snippet: string) => Partial<{ fg: RGBA; bg: RGBA; attrs: number }>;
    justify?: "center";
  }[];
}) => {
  const [idx, setIdx] = createSignal(
    typeof route().lastListIdx === "number" ? route().lastListIdx! : -1,
  );
  const [visIdx, setVisIdx] = createSignal(
    typeof route().lastListVisIdx === "number" ? route().lastListVisIdx! : 0,
  );

  const terminalDim = useTerminalDimensions();
  const top = () => {
    const borderY = 2,
      titleHeight = 1;
    return (
      constants.HEADER_HEIGHT +
      borderY +
      titleHeight +
      (cmdVisible() ? constants.CMDLINE_HEIGHT : 0) +
      (searchVisible() ? constants.CMDLINE_HEIGHT : 0)
    );
  };
  const height = () => {
    let { height } = terminalDim();
    return height - top();
  };

  const query = () => searchText().toLowerCase();
  const queryWords = () =>
    query()
      .split(" ")
      .filter((q) => q.trim().length > 0);
  const itemsFiltered = () => {
    const words = queryWords();
    if (words.length === 0) {
      return p.items;
    }

    return p.items.filter((i) =>
      words.every((q) =>
        p.columns.some((c) => i[c.render]!.toLowerCase().includes(q)),
      ),
    );
  };
  createEffect(() => {
    if (query() && visIdx() + height() >= itemsFiltered().length) {
      setVisIdx(Math.max(0, itemsFiltered().length - height()));
    }
  });

  const setIndex = (i: number) => {
    setIdx(i);
    if (i < visIdx()) {
      setVisIdx(i);
    } else if (i >= visIdx() + height()) {
      setVisIdx(i - height() + 1);
    }
    route().lastListIdx = i;
    route().lastListVisIdx = visIdx();
  };

  const [last_g, setLast_g] = createSignal(0);
  useKeyHandler((key) => {
    if (cmdVisible() || searchVisible() || vimVisible()) return;

    batch(() => {
      const i = idx();
      const items = itemsFiltered();
      if (["down", "j"].includes(key.name)) {
        setIndex(Math.min(i + 1, items.length - 1));
      } else if (["up", "k"].includes(key.name)) {
        setIndex(Math.max(i - 1, 0));
      } else if (key.name === "g" && !key.shift) {
        const now = +new Date();
        if (now - last_g() < 500) {
          setIndex(0);
        }
        setLast_g(now);
      } else if (key.name === "g" && key.shift) {
        setIndex(items.length - 1);
      } else {
        p.onKey?.(key, items[i]!);
      }
    });
  });

  const visibleItems = createMemo(() => {
    const items_filtered = itemsFiltered();
    const start = Math.min(Math.max(visIdx(), 0), items_filtered.length - 1);
    const columns = p.columns;
    const words = queryWords();
    return items_filtered.slice(start, start + height()).map((item, i) => {
      const isSelected = i + start === idx();
      const itemFg = isSelected ? colors().main.v950 : colors().fg;
      const itemBg = isSelected ? colors().main.v200 : colors().bg;
      const itemAttrs = isSelected ? TextAttributes.BOLD : TextAttributes.NONE;
      return {
        item,
        values: columns.map((c) => {
          let remaining = (item[c.render]! as string) || " ";

          const parts: {
            snippet: string;
            fg: RGBA;
            bg: RGBA;
            attrs: number;
          }[] = [];
          if (words.length === 0) {
            const syn = c.syn;
            if (syn) {
              const tokens = remaining.split(/(\s+)/);
              for (const token of tokens) {
                if (token.trim() === "") {
                  parts.push({
                    snippet: token,
                    fg: itemFg,
                    bg: itemBg,
                    attrs: itemAttrs,
                  });
                } else {
                  const synColors = syn(token);
                  parts.push({
                    snippet: token,
                    fg: synColors.fg || itemFg,
                    bg: synColors.bg || itemBg,
                    attrs:
                      synColors.attrs !== undefined
                        ? synColors.attrs
                        : itemAttrs,
                  });
                }
              }
            } else {
              parts.push({
                snippet: remaining,
                fg: itemFg,
                bg: itemBg,
                attrs: itemAttrs,
              });
            }
            return parts;
          }

          while (remaining) {
            let matched = false;
            for (const w of words) {
              let indexOf = -1;
              if ((indexOf = remaining.toLowerCase().indexOf(w)) !== -1) {
                if (indexOf > 0) {
                  parts.push({
                    snippet: remaining.slice(0, indexOf),
                    fg: itemFg,
                    bg: itemBg,
                    attrs: itemAttrs,
                  });
                }
                parts.push({
                  snippet: remaining.slice(indexOf, indexOf + w.length),
                  fg: colors().main.v600,
                  bg: colors().main.v100,
                  attrs: TextAttributes.BOLD,
                });
                remaining = remaining.slice(indexOf + w.length);
                matched = true;
              }
            }
            if (!matched && remaining) {
              parts.push({
                snippet: remaining,
                fg: itemFg,
                bg: itemBg,
                attrs: itemAttrs,
              });
              remaining = "";
            }
          }

          return parts;
        }),
        props: {
          bg: itemBg,
          fg: itemFg,
          attrs: itemAttrs,
        },
      };
    });
  });

  const title = () =>
    !searchVisible() && query() ? ` /${query()} ` : undefined;
  const width = () => {
    const { width } = terminalDim();
    return width;
  };

  const rightBorder = () => {
    return Array.from({ length: height() + 1 });
  };

  return (
    <box
      height={height() + 2 + 1}
      width={width()}
      title={title()}
      titleAlignment="left"
      border
      borderColor={colors().main.v500}
    >
      <box flexDirection="row" flexGrow={1} paddingLeft={1} paddingRight={1}>
        <Index each={p.columns}>
          {(column, colIndex) => (
            <>
              <box flexGrow={p.columns.length === 1 ? 1 : 0}>
                <text fg={colors().fg}>{column().title}</text>
                <Index each={visibleItems()}>
                  {(vitem) => (
                    <box
                      flexDirection="row"
                      justifyContent={column().justify}
                      backgroundColor={vitem().props.bg}
                    >
                      <Index each={vitem().values[colIndex]}>
                        {(v) => (
                          <text
                            fg={v().fg}
                            bg={v().bg}
                            attributes={
                              v().attrs | (column().attrs?.(vitem().item) || 0)
                            }
                          >
                            {v().snippet}
                          </text>
                        )}
                      </Index>
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

      <box
        position="absolute"
        width={1}
        backgroundColor={colors().bg}
        right={-1}
        top={top() - 2 - 1}
        height={height() + 1}
      >
        <Index each={rightBorder()}>
          {() => <text fg={colors().main.v500}>│</text>}
        </Index>
      </box>
    </box>
  );
};
