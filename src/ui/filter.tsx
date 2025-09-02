import { constants, filterText, setFilterText, setFilterVisible } from "../store";
import { colors } from "../util/colors";

export const Filter = () => {
  let ref: any;

  const onEnter = () => {
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
  return (
    <box
      flexDirection="row"
      borderColor={color()}
      border
      height={constants.CMDLINE_HEIGHT}
    >
      <text fg={color()}>/ </text>
      <input
        placeholder={"type to filter"}
        placeholderColor={colors().accent.v400}
        cursorColor={color()}
        textColor={colors().fg}
        focusedTextColor={colors().accent.v800}
        ref={el => { ref = el }}
        width={filterText().length ? filterText().length + 2 : 30}
        onInput={onInput}
        value={filterText()}
        onSubmit={onEnter}
        onKeyDown={onKeyDown}
        focused
        focusedBackgroundColor={colors().bg}
      />
    </box>
  );
};
