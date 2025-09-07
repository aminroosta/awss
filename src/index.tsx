import { getKeyHandler, TextAttributes } from "@opentui/core";
import { render, useRenderer } from "@opentui/solid";
import { ErrorBoundary, onMount, Show } from "solid-js";
import { colors } from "./util/colors";
import { cmdVisible, popRoute, setCmdVisible, undoPopRoute, setRevision, revision, filterVisible, setFilterVisible, setFilterText, filterText } from "./store";
import { Header } from "./ui/header";
import { CommandLine } from "./ui/commandline";
import { Notif } from "./ui/notif";
import { Router } from "./router";
import { Filter } from "./ui/filter";


function App() {
  let renderer = useRenderer();
  const keyHandler = getKeyHandler();

  onMount(() => {
    renderer.setCursorStyle('line');
  });

  keyHandler.on('keypress', (key: any) => {
    if (key.name === "escape") {
      if (cmdVisible()) {
        setCmdVisible(false);
      }
      else if (filterText()) {
        setFilterText('');
        setFilterVisible(false);
      }
    }
    if (cmdVisible() || filterVisible()) { return; }
    if (key.name === ":") {
      setCmdVisible(true);
      setFilterVisible(false);
    }
    if (key.name === "/") {
      setFilterText('');
      setFilterVisible(true);
      setCmdVisible(false);
    }
    if (key.name === "p" && key.ctrl) {
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
      <box>
        <Show when={filterVisible()}>
          <Filter />
        </Show>
      </box >
      <Router />
      <Notif />
    </box>
  );
}

function Root() {
  return (
    <ErrorBoundary
      fallback={(error: any) => (
        <box flexDirection="column">
          <text fg={colors().fg} bg={colors().bg}>⚠️ Something went wrong!</text>
          <text fg={colors().fg} bg={colors().bg} attributes={TextAttributes.BOLD}>
            {error.command ? '$ ' + error.command + '\n' : ''}
            {error.stderr ? '> ' + `${error.stderr}`.trim() + '\n' : ''}
          </text>
          <text fg={colors().fg} bg={colors().bg} attributes={TextAttributes.DIM}>{error.message}</text>
          <text fg={colors().fg} bg={colors().bg} attributes={TextAttributes.DIM}>{error.stack}</text>
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
