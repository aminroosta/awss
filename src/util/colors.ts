import { hexToRgb } from "@opentui/core";
import { getSystemTheme } from "./system";
import { createResource } from "solid-js";
import { vimVisible } from "../store";

const accent = {
  v200: hexToRgb("#e0dcf8"),
  v300: hexToRgb("#c8bff3"),
  v400: hexToRgb("#ac9aeb"),
  v500: hexToRgb("#8f71e1"),
  v600: hexToRgb("#7e53d4"),
  v700: hexToRgb("#6f42c1"),
  v800: hexToRgb("#5c36a1"),
  v900: hexToRgb("#4d2e84"),
  v950: hexToRgb("#2f1c59"),
};

const blue = {
  v100: hexToRgb("#d7f1ff"),
  v200: hexToRgb("#b9e8ff"),
  v300: hexToRgb("#88dbff"),
  v400: hexToRgb("#50c5ff"),
  v500: hexToRgb("#28a7ff"),
  v600: hexToRgb("#1e90ff"),
  v700: hexToRgb("#0a71eb"),
  v800: hexToRgb("#0f5abe"),
  v900: hexToRgb("#134e95"),
  v950: hexToRgb("#11305a"),
};

const invertKeys = <T>(color: T) => {
  const keys = Object.keys(color!) as (keyof typeof color)[];
  const inverted: Partial<typeof color> = {};
  keys.forEach((key, i) => {
    inverted[key] = color[keys[keys.length - 1 - i]!];
  });
  return inverted as T;
};

const dark = {
  bg: hexToRgb("#000000"),
  fg: hexToRgb("#ffffff"),
  caption: hexToRgb("#ffa500"),
  warn: hexToRgb("#ffa500"),
  error: hexToRgb("#ff4d4f"),
  dim: hexToRgb("#808080"),
  main: invertKeys(blue),
  accent: invertKeys(accent),
};

const light = {
  bg: hexToRgb("#ffffff"),
  fg: hexToRgb("#000000"),
  caption: hexToRgb("#dd571c"),
  warn: hexToRgb("#dd571c"),
  error: hexToRgb("#d9363e"),
  dim: hexToRgb("#808080"),
  main: blue,
  accent: accent,
};

const [colors, colorsActions] = createResource(
  async () => {
    const theme = await getSystemTheme();
    if (theme === "light") {
      return light;
    }
    return dark;
  },
  { initialValue: dark },
);

setInterval(() => {
  if (!vimVisible()) {
    colorsActions.refetch();
  }
}, 1000);

export { colors };
