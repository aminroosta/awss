import { Show, createEffect, For } from "solid-js";
import { colors } from "../util/colors";
import { notification, setNotification } from "../store";
import { bold } from "@opentui/core";

export const Notif = () => {
  createEffect(() => {
    const n = notification();
    if (!n) return;
    const id = setTimeout(() => setNotification(null as any), n.timeout);
    return () => clearTimeout(id);
  });

  const color = () => {
    const n = notification();
    if (!n) return colors().background;
    switch (n.level) {
      case 'error':
        return colors().error;
      case 'warn':
        return colors().warn;
      default:
        return colors().info;
    }
  };

  const lines = () => (notification()?.message || "").split(/\n/);

  return (
    <Show when={notification()}>
      <box
        zIndex={2}
        position="absolute"
        right={2}
        top={1}
        backgroundColor={colors().background}
        paddingLeft={1}
        paddingRight={1}
        border
        borderColor={color()}
      >
        <For each={lines()}>{(line) => (
          <text fg={color()}>{bold(line)}</text>
        )}</For>
      </box>
    </Show>
  );
};
