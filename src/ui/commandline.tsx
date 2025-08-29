import { useRenderer } from "@opentui/solid";
import { createSignal, onMount, type Ref } from "solid-js";
import { routes, setRoute } from "../store";
import { colors } from "../util/colors";


export const CommandLine = ({ onEscape }: { onEscape: Function }) => {
  const [value, setValue] = createSignal('');
  const [rest, setRest] = createSignal('');
  let ref;

  const aliases = Object.values(routes).map(s => s.alias).flat();

  const onEnter = () => {
    const route = Object.values(routes).find(s => s.alias.includes(value() + rest()));
    onEscape();
    // renderer.setCursorPosition(0, 0, false);
    if (route) {
      setRoute(route);
    }

  };
  const onKeyDown = (key: any) => {
    if (key.name === "escape") {
      onEscape();
    }
    if (key.name === "tab") {
      const val = value() + rest();
      setValue(val);
      setRest('');
      try {
        // @ts-ignore
        ref._cursorPosition = val.length;
      } catch (_e) { }
    }
  }
  const onInput = (text: string) => {
    setValue(text);
    if (text) {
      let option = aliases.find(o => o.startsWith(text)) || '';
      setRest(option.replace(text, ''));
    } else {
      setRest('');
    }
  }
  return (
    <box
      flexDirection="row"
      borderColor={colors().accent}
      border
      height={3}
    >
      <text fg={colors().accent}>▶ </text>
      <input
        cursorColor={colors().accent}
        ref={el => { ref = el }}
        width={value().length + 2}
        onInput={onInput}
        value={value()}
        onSubmit={onEnter}
        onKeyDown={onKeyDown}
        focused
        focusedBackgroundColor={colors().background}
      />
      <text marginLeft={-2} fg={colors().dim}>{rest()}</text>
    </box>
  );
};
