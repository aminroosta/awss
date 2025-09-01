import { useKeyHandler } from "@opentui/solid";
import { modal, modals, setModal } from "../store";
import { colors } from "../util/colors";
import { log } from "../util/log";
import { Match, Show, Switch } from "solid-js";
import { File } from '../route/file';

export const Modal = () => {
  useKeyHandler(key => {
    if (['escape', ':', 'enter'].includes(key.name)) {
      setModal(null as any);
    }
  });

  return (
    <Show when={modal()}>
      <box
        zIndex={1}
        backgroundColor={colors().bg}
        left={10} right={10} top={4} bottom={4}
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
