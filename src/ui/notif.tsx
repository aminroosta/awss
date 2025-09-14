import { Show, createEffect, For } from "solid-js";
import { colors } from "../util/colors";
import { notification, setNotification } from "../store";
import { bold } from "@opentui/core";
import { useTerminalDimensions } from "@opentui/solid";

export const Notif = () => {
  createEffect(() => {
    const n = notification();
    if (!n) return;
    const id = setTimeout(() => setNotification(null as any), n.timeout);
    return () => clearTimeout(id);
  });
  const terminalDim = useTerminalDimensions();

  const color = () => {
    const n = notification();
    if (!n) return colors().bg;
    switch (n.level) {
      case "error":
        return colors().error;
      case "warn":
        return colors().warn;
      default:
        return colors().fg;
    }
  };

  const maxWidth = () =>
    Math.min(
      Math.max((terminalDim().width * 0.6) | 0, 100),
      terminalDim().width - 20,
    );

  const lines = () => {
    const availableWidth = maxWidth() - 4;
    const rawLines = (notification()?.message || "").split(/\n/);
    const result: string[] = [];
    for (const line of rawLines) {
      let current = line;
      while (current.length > availableWidth) {
        result.push(current.slice(0, availableWidth));
        current = current.slice(availableWidth);
      }
      if (current.length > 0) result.push(current);
    }
    return result;
  };

  return (
    <Show when={notification()}>
      <box
        zIndex={2}
        maxWidth={maxWidth()}
        position="absolute"
        right={2}
        top={1}
        backgroundColor={colors().bg}
        paddingLeft={1}
        paddingRight={1}
        border
        borderColor={color()}
      >
        <For each={lines()}>
          {(line) => <text fg={color()}>{bold(line)}</text>}
        </For>
      </box>
    </Show>
  );
};
