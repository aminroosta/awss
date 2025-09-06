import { useKeyHandler } from "@opentui/solid";
import { cmdVisible, constants, filterVisible, modal, modals, setModal } from "../store";
import { colors } from "../util/colors";
import { Match, Show, Switch } from "solid-js";
import { File } from '../route/file';

export const Modal = () => {
  const top = () => {
    return constants.HEADER_HEIGHT + 1 + (filterVisible() ? constants.CMDLINE_HEIGHT : 0);
  }

  return (
    <Show when={modal()}>
      <box
        zIndex={1}
        backgroundColor={colors().bg}
        left={1} right={1} top={top()} bottom={2}
        position="absolute"
      >
        <Switch>
          <Match when={modal().id === modals.File.id}>
            <File args={modal().args as any} />
          </Match>
        </Switch>
      </box>
    </Show>
  );
}
