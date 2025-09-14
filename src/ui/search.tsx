import {
  constants,
  searchText,
  route,
  setSearchText,
  setSearchVisible,
} from "../store";
import { colors } from "../util/colors";
import { log } from "../util/log";
import { stripInvisible } from "../util/str";

export const Search = () => {
  let ref: any;

  const onSubmit = () => {
    setSearchVisible(false);
  };
  const onKeyDown = (key: any) => {
    if (key.name === "escape") {
      setSearchText("");
      setSearchVisible(false);
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
          log({ stripped, len: stripped.length });
          const val = searchText() + stripped;
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
    log({ text });
    setSearchText(text);
  };
  const color = () => colors().accent.v700;
  const placeholder = () => route()!.searchPlaceholder || "Type to search";
  return (
    <box
      flexDirection="row"
      borderColor={color()}
      border
      height={constants.CMDLINE_HEIGHT}
    >
      <text fg={color()}>/ </text>
      <input
        placeholder={placeholder()}
        placeholderColor={colors().accent.v300}
        cursorColor={color()}
        textColor={colors().fg}
        focusedTextColor={colors().accent.v800}
        ref={(el) => {
          ref = el;
        }}
        width={searchText().length ? searchText().length + 2 : 60}
        onInput={onInput}
        value={searchText()}
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
        focused
        focusedBackgroundColor={colors().bg}
      />
    </box>
  );
};
