import { getKeyHandler, TextAttributes } from "@opentui/core";
import { render, useRenderer } from "@opentui/solid";
import { createSignal, ErrorBoundary, Show } from "solid-js";
import { colors } from "./util/colors";
import { Header } from "./ui/header";
import { CommandLine } from "./ui/commandline";
import { route } from "./store";

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
    renderer.setCursorPosition(0, 0, false);
  };

  const title = () => route().title;
  const Service = () => route().component;

  return (
    <box flexGrow={1} backgroundColor={colors().background}>
      <Header />
      <Show when={cmdVisible()}>
        <CommandLine onEscape={onCommandLineEscape} />
      </Show>
      <box flexGrow={1} title={title()} titleAlignment="center" border borderColor={colors().border}>
        {Service()}
      </box>
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
