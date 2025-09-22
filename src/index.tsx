import { getKeyHandler, Selection, TextAttributes } from "@opentui/core";
import { render, useRenderer, useSelectionHandler } from "@opentui/solid";
import { createEffect, ErrorBoundary, onMount, Show } from "solid-js";
import { colors } from "./util/colors";
import {
  cmdVisible,
  popRoute,
  setCmdVisible,
  undoPopRoute,
  setRevision,
  revision,
  searchVisible,
  setSearchVisible,
  setSearchText,
  searchText,
  tmuxPopupVisible,
} from "./store";
import { Header } from "./ui/header";
import { CommandLine } from "./ui/commandline";
import { Notif } from "./ui/notif";
import { Router } from "./router";
import { Search } from "./ui/search";
import { log } from "./util/log";
import { copyToClipboard } from "./util/system";

function App() {
  let renderer = useRenderer();
  const keyHandler = getKeyHandler();

  onMount(() => {
    renderer.setCursorStyle("line");
  });
  createEffect(() => {
    if (tmuxPopupVisible()) {
      renderer.pause();
    } else {
      renderer.start();
      (renderer as any).lib.render(renderer.rendererPtr, true);
    }
  });

  keyHandler.on("keypress", (key: any) => {
    if (tmuxPopupVisible()) {
      return;
    }
    if (key.name === "escape") {
      if (cmdVisible()) {
        setCmdVisible(false);
      } else if (searchText()) {
        setSearchText("");
        setSearchVisible(false);
      }
    }
    if (cmdVisible() || searchVisible()) {
      return;
    }
    if (key.name === ":") {
      setCmdVisible(true);
      setSearchVisible(false);
    }
    if (key.name === "/") {
      setSearchText("");
      setSearchVisible(true);
      setCmdVisible(false);
    }
    if (key.name === "o" && key.ctrl) {
      popRoute();
    }
    if ((key.name === "i" && key.ctrl) || (key.name === "tab" && !key.ctrl)) {
      undoPopRoute();
    }
    if (key.name === "r") {
      setRevision((rev) => rev + 1);
    }
  });

  useSelectionHandler((selection: Selection) => {
    const selectedText = selection.getSelectedText();

    if (selectedText) {
      copyToClipboard(selectedText);
    }
  });

  return (
    <box height="100%" flexGrow={1} backgroundColor={colors().bg}>
      <Header />
      <box>
        <Show when={cmdVisible()}>
          <CommandLine />
        </Show>
      </box>
      <box>
        <Show when={searchVisible()}>
          <Search />
        </Show>
      </box>
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
          <text fg={colors().fg} bg={colors().bg}>
            ⚠️ Something went wrong!
          </text>
          <text
            fg={colors().fg}
            bg={colors().bg}
            attributes={TextAttributes.BOLD}
          >
            {error.command ? "$ " + error.command + "\n" : ""}
            {error.stderr ? "> " + `${error.stderr}`.trim() + "\n" : ""}
          </text>
          <text
            fg={colors().fg}
            bg={colors().bg}
            attributes={TextAttributes.DIM}
          >
            {error.message}
          </text>
          <text
            fg={colors().fg}
            bg={colors().bg}
            attributes={TextAttributes.DIM}
          >
            {error.stack}
          </text>
        </box>
      )}
    >
      <App />
    </ErrorBoundary>
  );
}

render(Root, {
  targetFps: 60,
});
