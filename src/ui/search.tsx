import { constants, searchText, route, setSearchText, setSearchVisible } from "../store";
import { colors } from "../util/colors";
import { log } from "../util/log";

export const Search = () => {
  let ref: any;

  const onSubmit = () => {
    setSearchVisible(false);
  };
  const onKeyDown = (key: any) => {
    if (key.name === "escape") {
      setSearchText('')
      setSearchVisible(false);
    }
  };
  const onInput = (text: string) => {
    setSearchText(text);
  };
  const color = () => colors().accent.v700;
  const placeholder = () => route().searchPlaceholder || 'Type to search';
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
        ref={el => { ref = el }}
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
