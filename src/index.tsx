import { getKeyHandler, TextAttributes } from "@opentui/core";
import { render, useRenderer } from "@opentui/solid";
import { createSignal, ErrorBoundary, Match, onMount, Show, Switch } from "solid-js";
import { colors } from "./util/colors";
import { Header } from "./ui/header";
import { CommandLine } from "./ui/commandline";
import { cmdVisible, route, setCmdVisible } from "./store";
import { Buckets } from "./route/buckets";
import { Stacks } from "./route/stacks";

function ActiveRoute() {
  return (
    <Switch>
      <Match when={route().id === 'stacks'}>
        <Stacks />
      </Match>
      <Match when={route().id === 'buckets'}>
        <Buckets />
      </Match>
    </Switch>
  )
}

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
  });

  return (
    <box flexGrow={1} backgroundColor={colors().background}>
      <Header />
      <box>
        <Show when={cmdVisible()}>
          <CommandLine />
        </Show>
      </box>
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
