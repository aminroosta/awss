import { createSignal } from "solid-js";
import { constants, pushRoute, routes, setCmdVisible } from "../store";
import { colors } from "../util/colors";


export const CommandLine = () => {
  const [value, setValue] = createSignal('');
  const [rest, setRest] = createSignal('');
  let ref;

  const aliases = Object.values(routes).map(s => s.alias).flat();

  const onEnter = () => {
    const route = Object.values(routes).find(s => s.alias.includes(value() + rest()));
    setCmdVisible(false);
    if (route) {
      pushRoute(route);
    }

  };
  const onKeyDown = (key: any) => {
    if (key.name === "escape") {
      setCmdVisible(false);
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
  const placeholder = (
    ''.padEnd(8, ' ') +
    Object.values(routes).filter(r => r.alias.length).map(r => r.alias[0] || '').join('|')
  ).slice(0, 37) + '...';
  return (
    <box
      flexDirection="row"
      borderColor={colors().accent}
      border
      height={constants.CMDLINE_HEIGHT}
    >
      <text fg={colors().accent}>▶ </text>
      <input
        placeholder={placeholder}
        placeholderColor={colors().accent}
        cursorColor={colors().accent}
        ref={el => { ref = el }}
        width={value().length ? value().length + 2 : 40}
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
