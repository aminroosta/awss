import { children } from "solid-js";
import { colors } from "../util/colors";
import { bold } from "@opentui/core";

export const Title = (p: {
  title: string;
  filter?: string;
  count: number | string;
}) => {
  return (
    <box width="100%" alignItems="center" marginBottom={-1} zIndex={1}>
      <box flexDirection="row" backgroundColor={colors().bg}>
        <text fg={colors().fg}>{"  "}</text>
        <text fg={colors().fg}>{bold(p.title)}</text>
        <text fg={colors().fg} visible={p.filter !== undefined}>
          {bold("(")}
        </text>
        <text fg={colors().main.v500} visible={p.filter !== undefined}>
          {bold(p.filter!)}
        </text>
        <text fg={colors().fg} visible={p.filter !== undefined}>
          {bold(")")}
        </text>
        <text fg={colors().fg}>[</text>
        <text fg={colors().accent.v800}>{bold(p.count)}</text>
        <text fg={colors().fg}>]</text>
        <text fg={colors().fg}>{"  "}</text>
      </box>
    </box>
  );
};
