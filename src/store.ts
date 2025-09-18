import { createEffect, createSignal } from "solid-js";
import { saveSession, loadSession } from "./util/session";
import "./router";
import { routes } from "./route/factory/registerRoute";
import type { ParsedKey } from "@opentui/core";
import { log } from "./util/log";

export { routes } from "./route/factory/registerRoute";

export const [cmdVisible, setCmdVisible] = createSignal(false);
export const [vimVisible, setVimVisible] = createSignal(false);
export const [revision, setRevision] = createSignal(1);

export const constants = {
  HEADER_HEIGHT: 7,
  CMDLINE_HEIGHT: 3,
};

/******** route management ********/
const initialRoute = routes[loadSession().lastRouteId || "buckets"]!;
let routeStack = [initialRoute];
let [routeStackLen, setRouteStackLen] = createSignal(1);
export const [route, setRoute] = createSignal(initialRoute);

export function pushRoute(r: { id: string; args: { [key: string]: any } }) {
  let currentRoute = route();
  const newRoute = Object.assign({}, routes[r.id], { args: r.args });

  if (JSON.stringify(currentRoute) === JSON.stringify(newRoute)) {
    return;
  }
  currentRoute!.lastSearch = searchText();

  routeStack = [...routeStack.slice(0, routeStackLen()), newRoute];
  setRouteStackLen(routeStack.length);
  setRoute(newRoute);

  if (newRoute.alias.length > 0) {
    saveSession({ lastRouteId: newRoute.id });
  }
}
export function popRoute() {
  if (routeStackLen() >= 2) {
    setRouteStackLen(routeStackLen() - 1);
    setRoute(routeStack[routeStackLen() - 1]!);
  }
}
export function undoPopRoute() {
  if (routeStackLen() < routeStack.length) {
    setRouteStackLen(routeStackLen() + 1);
    setRoute(routeStack[routeStackLen() - 1]!);
  }
}

/********* notifications *********/
type Notification = {
  message: string;
  level: "info" | "warn" | "error";
  timeout: number;
} | null;
export const [notification, setNotification] = createSignal<Notification>(null);

/********* search ********/
export const [searchText, setSearchText] = createSignal("");
export const [searchVisible, setSearchVisible] = createSignal(false);
createEffect(() => {
  const r = route();
  setSearchText(r.lastSearch || "");
});

/********* actions ********/
export const actions = () => {
  let all = [];
  let showRouteActions = false;
  if (cmdVisible()) {
    all.push({ key: "esc", name: "Dismiss" });
    all.push({ key: "enter", name: "Run Command" });
  } else if (searchVisible()) {
    all.push({ key: "esc", name: "Dismiss" });
    all.push({ key: "enter", name: "Apply" });
  } else {
    showRouteActions = true;
    all.push({ key: "˸", name: "Command Line" });
    all.push({ key: "/", name: "Search" });
    all.push({ key: "j|down", name: "Move Down" });
    all.push({ key: "k|up", name: "Move Up" });
    all.push({ key: "r", name: "Refresh" });
  }
  if (routeStackLen() >= 2) {
    all.push({ key: "ctrl+o", name: "Go Back" });
  }
  if (routeStackLen() < routeStack.length) {
    all.push({ key: "ctrl+i", name: "Go Forward" });
  }
  while (all.length < constants.HEADER_HEIGHT) {
    all.push({ key: "", name: "" });
  }

  if (showRouteActions) {
    const routeActions = route()?.keymaps?.map((km) => {
      if (typeof km.key === "string") {
        return { key: km.key, name: km.name };
      }
      if (km.key.ctrl) {
        return { key: "ctrl+" + km.key.name!, name: km.name };
      }
      if (km.key.meta) {
        return { key: "alt+" + km.key.name!, name: km.name };
      }
      if (km.key.shift) {
        return { key: "shift+" + km.key.name!, name: km.name };
      }
      return { key: km.key.name!, name: km.name };
    });
    all.push(...(routeActions || []));
  }

  return all;
};
