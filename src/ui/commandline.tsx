import { createSignal } from "solid-js";
import { constants, pushRoute, routes, setCmdVisible } from "../store";
import { colors } from "../util/colors";
import { log } from "../util/log";
import { stripInvisible } from "../util/str";

export const CommandLine = () => {
  const [value, setValue] = createSignal("");
  const [rest, setRest] = createSignal("");
  let ref: any;

  const aliases = Object.values(routes)
    .map((s) => s.alias)
    .flat();

  const onEnter = () => {
    const route = Object.values(routes).find((s) =>
      s.alias.includes(value() + rest()),
    );
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
      setRest("");
      try {
        // @ts-ignore
        ref._cursorPosition = val.length;
      } catch (_e) {}
    }

    const clipboard = {
      name: "",
      ctrl: false,
      meta: false,
      shift: false,
      option: false,
      number: false,
    };
    if (Object.entries(clipboard).every(([k, v]) => key[k] === v)) {
      if (key.sequence === key.raw) {
        const stripped = stripInvisible(key.raw);
        if (stripped) {
          const val = value() + stripped;
          onInput(val);
          try {
            // @ts-ignore
            ref._cursorPosition = val.length;
          } catch (_e) {}
        }
      }
    }
  };
  const onInput = (text: string) => {
    setValue(text);
    if (text) {
      let option = aliases.find((o) => o.startsWith(text)) || "";
      setRest(option.replace(text, ""));
    } else {
      setRest("");
    }
  };
  const limit = 80;
  const placeholder =
    (
      "".padEnd(8, " ") +
      Object.values(routes)
        .filter((r) => r.alias.length)
        .map((r) => r.alias[0] || "")
        .join("|")
    ).slice(0, limit - 1) + "…";

  const color = () => colors().accent.v700;
  return (
    <box
      flexDirection="row"
      borderColor={color()}
      border
      height={constants.CMDLINE_HEIGHT}
    >
      <text fg={color()}>▶ </text>
      <input
        placeholder={placeholder}
        placeholderColor={colors().accent.v400}
        cursorColor={color()}
        textColor={colors().fg}
        focusedTextColor={colors().accent.v800}
        ref={(el) => {
          ref = el;
        }}
        width={value().length ? value().length + 2 : limit}
        onInput={onInput}
        value={value()}
        onSubmit={onEnter}
        onKeyDown={onKeyDown}
        focused
        focusedBackgroundColor={colors().bg}
      />
      <text marginLeft={-2} fg={colors().accent.v400}>
        {rest()}
      </text>
    </box>
  );
};
