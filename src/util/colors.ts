import { hexToRgb } from "@opentui/core";
import { getSystemTheme } from "./system";
import { createResource } from "solid-js";


const accent = {
  v200: hexToRgb('#e0dcf8'),
  v300: hexToRgb('#c8bff3'),
  v400: hexToRgb('#ac9aeb'),
  v500: hexToRgb('#8f71e1'),
  v600: hexToRgb('#7e53d4'),
  v700: hexToRgb('#6f42c1'),
  v800: hexToRgb('#5c36a1'),
  v900: hexToRgb('#4d2e84'),
  v950: hexToRgb('#2f1c59'),
};

const invertKeys = <T>(color: T) => {
  const keys = Object.keys(color!) as (keyof typeof color)[];
  const inverted: Partial<typeof color> = {};
  keys.forEach((key, i) => {
    inverted[key] = color[keys[keys.length - 1 - i]!];
  });
  return inverted as T;
}

const dark = {
  bg: hexToRgb('#000000'),
  fg: hexToRgb('#ffffff'),
  border: hexToRgb('#6e96ef'),
  primary: hexToRgb('#6e96ef'),
  invert: hexToRgb('#1c264a'),
  info: hexToRgb('#1e90ff'),
  warn: hexToRgb('#ffa500'),
  caption: hexToRgb('#ffa500'),
  error: hexToRgb('#ff4d4f'),
  accent: invertKeys(accent),
  active: hexToRgb('#ff00ff'),
  dim: hexToRgb('#808080'),
};

const light = {
  bg: hexToRgb('#ffffff'),
  fg: hexToRgb('#000000'),
  border: hexToRgb('#1e90ff'),
  primary: hexToRgb('#1e90ff'),
  invert: hexToRgb('#edf9ff'),
  info: hexToRgb('#1e90ff'),
  caption: hexToRgb('#dd571c'),
  warn: hexToRgb('#dd571c'),
  error: hexToRgb('#d9363e'),
  accent: accent,
  active: hexToRgb('#ff00ff'),
  dim: hexToRgb('#808080'),
};

const [colors, colorsActions] = createResource(async () => {
  const theme = await getSystemTheme();
  if (theme === 'light') {
    return light;
  }
  return dark;
}, { initialValue: dark });

setInterval(() => {
  colorsActions.refetch();
}, 1000);


export { colors };
