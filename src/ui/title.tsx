import { children } from "solid-js";
import { colors } from "../util/colors";
import { bold } from "@opentui/core";

export const Title = (p: { title: string, filter?: string, count: number | string}) => {
  return (
    <box width='100%' alignItems="center" marginBottom={-1} zIndex={1}>
      <box flexDirection="row" backgroundColor={colors().background}>
        <text>{'  '}</text>
        {bold(p.title)}
        <text visible={p.filter !== undefined}>{bold('(')}</text>
        <text visible={p.filter !== undefined} fg={colors().primary}>{bold(p.filter!)}</text>
        <text visible={p.filter !== undefined}>{bold(')')}</text>
        <text>[</text>
        <text fg={colors().accent}>{p.count}</text>
        <text>]</text>
        <text>{'  '}</text>
      </box>
    </box>
  );
}
