import { getKeyHandler, TextAttributes } from "@opentui/core";
import { render, useRenderer } from "@opentui/solid";
import { createSignal, ErrorBoundary, Match, Show, Switch } from "solid-js";
import { colors } from "./util/colors";
import { Header } from "./ui/header";
import { CommandLine } from "./ui/commandline";
import { route } from "./store";
import { Dynamic } from "solid-js/web";
import { Buckets } from "./route/buckets";
import { Stacks } from "./route/stacks";

function ActiveRoute() {
  return (
    <box flexGrow={1} title={route().title} titleAlignment="center" border borderColor={colors().border}>
      <Switch>
        <Match when={route().id === 'buckets'}>
          <Buckets />
        </Match>
        <Match when={route().id === 'stacks'}>
          <Stacks />
        </Match>
      </Switch>
    </box>
  )
}

function App() {
  let [cmdVisible, setCmdVisible] = createSignal(true);
  let renderer = useRenderer();
  const keyHandler = getKeyHandler();

  keyHandler.on('keypress', (key: any) => {
    if (key.name === ":") {
      setCmdVisible(true);
    }
  });

  const onCommandLineEscape = () => {
    setCmdVisible(false)
    // renderer.setCursorPosition(0, 0, false);
  };

  return (
    <box flexGrow={1} backgroundColor={colors().background}>
      <Header />
      <Show when={cmdVisible()}>
        <CommandLine onEscape={onCommandLineEscape} />
      </Show>
      <ActiveRoute />
    </box>
  );
}

function Root() {
  return (
    <ErrorBoundary
      fallback={(error: any) => (
        <box flexDirection="column">
          <text>⚠️ Something went wrong!</text>
          <text attributes={TextAttributes.BOLD}>
            {error.command ? '$ ' + error.command + '\n' : ''}
            {error.stderr ? '> ' + `${error.stderr}`.trim() + '\n' : ''}
          </text>
          <text attributes={TextAttributes.DIM}>{error.message}</text>
          <text attributes={TextAttributes.DIM}>{error.stack}</text>
        </box>
      )}
    >
      <App />
    </ErrorBoundary>
  );
}

render(Root, { targetFps: 30 });
