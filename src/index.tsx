import { getKeyHandler, TextAttributes } from "@opentui/core";
import { render, useRenderer } from "@opentui/solid";
import { createSignal, ErrorBoundary, Match, onMount, Show, Switch } from "solid-js";
import { colors } from "./util/colors";
import { cmdVisible, popRoute, route, setCmdVisible, undoPopRoute, setRevision, revision } from "./store";
import { Header } from "./ui/header";
import { CommandLine } from "./ui/commandline";
import { log } from "./util/log";
import { Modal } from "./ui/modal";
import { Notif } from "./ui/notif";
import { Router } from "./router";


function App() {
  let renderer = useRenderer();
  const keyHandler = getKeyHandler();

  onMount(() => {
    renderer.setCursorStyle('line');
  });

  keyHandler.on('keypress', (key: any) => {
    if (key.name === ":") {
      setCmdVisible(true);
    }
    if (key.name === "escape") {
      popRoute();
    }
    if (key.name === "n" && key.ctrl) {
      undoPopRoute();
    }
    if (key.name === "r") {
      setRevision(rev => rev + 1);
    }
  });

  return (
    <box
      height='100%'
      flexGrow={1}
      backgroundColor={colors().bg}
    >
      <Header />
      <box>
        <Show when={cmdVisible()}>
          <CommandLine />
        </Show>
      </box>
      <Router />
      <Modal />
      <Notif />
    </box>
  );
}

function Root() {
  return (
    <ErrorBoundary
      fallback={(error: any) => (
        <box flexDirection="column">
          <text fg={colors().fg}>⚠️ Something went wrong!</text>
          <text fg={colors().fg} attributes={TextAttributes.BOLD}>
            {error.command ? '$ ' + error.command + '\n' : ''}
            {error.stderr ? '> ' + `${error.stderr}`.trim() + '\n' : ''}
          </text>
          <text fg={colors().fg} attributes={TextAttributes.DIM}>{error.message}</text>
          <text fg={colors().fg} attributes={TextAttributes.DIM}>{error.stack}</text>
        </box>
      )}
    >
      <App />
    </ErrorBoundary>
  );
}

render(Root, {
  targetFps: 60
});
