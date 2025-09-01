import { getKeyHandler, TextAttributes } from "@opentui/core";
import { render, useRenderer } from "@opentui/solid";
import { createSignal, ErrorBoundary, Match, onMount, Show, Switch } from "solid-js";
import { colors } from "./util/colors";
import { Header } from "./ui/header";
import { CommandLine } from "./ui/commandline";
import { cmdVisible, popRoute, route, setCmdVisible, undoPopRoute, setRevision, revision } from "./store";
import { Buckets } from "./route/buckets";
import { Stacks } from "./route/stacks";
import { log } from "./util/log";
import { S3Objects } from "./route/s3objects";
import { Resources } from "./route/resources";
import { Vpcs } from "./route/vpcs";
import { Repositories } from "./route/repositories";
import { Images } from "./route/images";
import { Modal } from "./ui/modal";
import { Notif } from "./ui/notif";

function ActiveRoute() {
  return (
    <Switch>
      <Match when={route().id === 'stacks'}>
        <Stacks />
      </Match>
      <Match when={route().id === 'buckets'}>
        <Buckets />
      </Match>
      <Match when={route().id === 'objects'}>
        <S3Objects args={route().args as any} />
      </Match>
      <Match when={route().id === 'resources'}>
        <Resources args={route().args as any} />
      </Match>
      <Match when={route().id === 'vpcs'}>
        <Vpcs />
      </Match>
      <Match when={route().id === 'repositories'}>
        <Repositories />
      </Match>
      <Match when={route().id === 'images'}>
        <Images args={route().args as any} />
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
    if (key.name === "p" && key.ctrl) {
      popRoute();
    }
    if (key.name === "n" && key.ctrl) {
      undoPopRoute();
    }
    if (key.name === "r") {
      setRevision(rev => rev + 1);
      log({ rev: revision() });
    }
  });

  return (
    <box
      height='100%'
      flexGrow={1}
      backgroundColor={colors().background}
    >
      <Header />
      <box>
        <Show when={cmdVisible()}>
          <CommandLine />
        </Show>
      </box>
      <ActiveRoute />
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
