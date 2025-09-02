import { getKeyHandler, TextAttributes } from "@opentui/core";
import { render, useRenderer } from "@opentui/solid";
import { createSignal, ErrorBoundary, Match, onMount, Show, Switch } from "solid-js";
import { colors } from "./util/colors";
import { cmdVisible, filterVisible, setFilterVisible, setFilterText, popRoute, route, setCmdVisible, undoPopRoute, setRevision, revision, filterText, modal, setModal } from "./store";
import { Header } from "./ui/header";
import { CommandLine } from "./ui/commandline";
import { Filter } from "./ui/filter";
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
      setFilterVisible(false);
    }
    if (key.name === "/") {
      setFilterText('');
      setFilterVisible(true);
      setCmdVisible(false);
    }
    if (key.name === "escape") {
      if (filterText()) {
        setFilterText('');
      }
      else if (modal()) {  }
      else {
        popRoute();
      }
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
      <Modal />
      <Notif />
    </box >
  );
}

function Root() {
  return (
    <ErrorBoundary
      fallback={(error: any) => (
        <box flexDirection="column">
          <text fg={colors().error}>⚠️ Something went wrong!</text>
          <text fg={colors().error} attributes={TextAttributes.BOLD}>
            {error.command ? '$ ' + error.command + '\n' : ''}
            {error.stderr ? '> ' + `${error.stderr}`.trim() + '\n' : ''}
          </text>
          <text fg={colors().error} attributes={TextAttributes.ITALIC}>{error.message}</text>
          <text fg={colors().error} attributes={TextAttributes.ITALIC}>{error.stack}</text>
        </box>
      )}
    >
      <App />
    </ErrorBoundary>
  );
}

render(Root, { targetFps: 30 });
