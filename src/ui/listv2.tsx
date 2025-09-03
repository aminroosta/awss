import { bold, dim, getKeyHandler, TextAttributes } from "@opentui/core";
import { batch, createEffect, createSignal, For, onCleanup, onMount, Show, type Accessor } from "solid-js";
import { colors } from "../util/colors";
import { cmdVisible, constants, modal } from "../store";
import { useKeyHandler, useTerminalDimensions } from "@opentui/solid";


export const ListV2 = (p: {
  items: string[],
  onEnter: (item: any) => void,
  isModal?: boolean
}) => {
  const [idx, setIdx] = createSignal(-1);
  const [visIdx, setVisIdx] = createSignal(0);

  const terminalDim = useTerminalDimensions()
  const height = () => {
    let { height } = terminalDim();
    return height - constants.HEADER_HEIGHT
      - 2 - 1 // border and title
      - (cmdVisible() ? constants.CMDLINE_HEIGHT : 0)
  };
  const width = () => {
    let { width } = terminalDim();
    return width - 2 - 2; // border and padding
  }

  const lines = () => {
    let result = [];
    let w = width(), h = height(), items = p.items;
    for (let i = Math.max(visIdx(), 0), end = i + h; i < end; i++) {
      let line = '';
      if (i < items.length) {
        line = items[i]!.padEnd(w, ' ').slice(0, w);
      }
      result.push(line);
    }
    return result;
  };

  const linesWithProps = () => {
    let idx_ = idx(), visIdx_ = visIdx(), colors_ = colors();
    return lines().map(
      (line, i) => (i + visIdx_) === idx_ ? ({
        line,
        bg: colors_.main.v200,
        fg: colors_.main.v950,
        attributes: TextAttributes.BOLD
      }) : ({
        line,
        bg: colors_.bg,
        fg: colors_.fg,
        attributes: TextAttributes.NONE
      })
    );
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


  return (
    <box
      border borderColor={colors().main.v500}
      flexDirection="column" flexGrow={1}
      paddingLeft={1} paddingRight={1}
    >
      <For each={linesWithProps()}>
        {(line, colIndex) => (
          <text fg={line.fg} bg={line.bg} attributes={line.attributes}>{line.line}</text>
        )}
      </For>
    </box>
  );
}
