import { hexToRgb } from "@opentui/core";
import { useState } from "react";
import { getSystemTheme } from "./system";
import { createResource } from "solid-js";

const dark = {
  background: hexToRgb('#000000'),
  foreground: hexToRgb('#ffffff'),
  border: hexToRgb('#6e96ef'),
  primary: hexToRgb('#6e96ef'),
  invert: hexToRgb('#1c264a'),
  info: hexToRgb('#ffa500'),
  highlight: hexToRgb('#1e90ff'),
  accent: hexToRgb('#00ffff'),
  active: hexToRgb('#ff00ff'),
  dim: hexToRgb('#808080'),
};

const light = {
  background: hexToRgb('#ffffff'),
  foreground: hexToRgb('#000000'),
  border: hexToRgb('#1e90ff'),
  primary: hexToRgb('#1e90ff'),
  invert: hexToRgb('#edf9ff'),
  info: hexToRgb('#dd571c'),
  highlight: hexToRgb('#1e90ff'),
  accent: hexToRgb('#6f42c1'),
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
