import { hexToRgb } from "@opentui/core";
import { useState } from "react";
import { getSystemTheme } from "./system";
import { createResource } from "solid-js";

const dark = {
  background: hexToRgb('#000000'),
  border: hexToRgb('#87cefa'),
  primary: hexToRgb('#87cefa'),
  info: hexToRgb('#ffa500'),
  highlight: hexToRgb('#1e90ff'),
  accent: hexToRgb('#00ffff'),
  active: hexToRgb('#ff00ff'),
  dim: hexToRgb('#808080'),
};

const light = {
  background: hexToRgb('#ffffff'),
  border: hexToRgb('#1e90ff'),
  primary: hexToRgb('#1e90ff'),
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
