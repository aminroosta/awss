import { constants, filterText, route, setFilterText, setFilterVisible } from "../store";
import { colors } from "../util/colors";
import { log } from "../util/log";

export const Filter = () => {
  let ref: any;

  const onSubmit = () => {
    setFilterVisible(false);
  };
  const onKeyDown = (key: any) => {
    if (key.name === "escape") {
      setFilterText('')
      setFilterVisible(false);
    }
  };
  const onInput = (text: string) => {
    setFilterText(text);
  };
  const color = () => colors().accent.v700;
  const placeholder = () => route().filterPlaceholder || 'Type to filter';
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
        width={filterText().length ? filterText().length + 2 : 60}
        onInput={onInput}
        value={filterText()}
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
        focused
        focusedBackgroundColor={colors().bg}
      />
    </box>
  );
};
