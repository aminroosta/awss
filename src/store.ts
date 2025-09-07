import { createEffect, createSignal } from "solid-js";
import { saveSession, loadSession } from "./util/session";
import './router';
import { routes } from "./route/factory/registerRoute";


export { routes } from "./route/factory/registerRoute";

export const [cmdVisible, setCmdVisible] = createSignal(false);
export const [revision, setRevision] = createSignal(1);

export const constants = {
  HEADER_HEIGHT: 7,
  CMDLINE_HEIGHT: 3,
}

/******** route management ********/
const initialRoute = routes[loadSession().lastRouteId || 'buckets'];
let routeStack = [initialRoute];
let [routeStackLen, setRouteStackLen] = createSignal(1);
export const [route, setRoute] = createSignal(initialRoute);

export function pushRoute(r: {
  id: string;
  args: { [key: string]: any };
}) {
  const newRoute = {
    ...routes[r.id],
    args: r.args,
  };

  if (JSON.stringify(route()) === JSON.stringify(newRoute)) {
    return;
  }
  routeStack = [...routeStack.slice(0, routeStackLen()), newRoute]
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
type Notification = { message: string; level: 'info' | 'warn' | 'error'; timeout: number } | null;
export const [notification, setNotification] = createSignal<Notification>(null);

/********* filter ********/
export const [filterText, setFilterText] = createSignal('');
export const [filterVisible, setFilterVisible] = createSignal(false);
createEffect(() => {
  const _ = route();
  setFilterText('');
});

/********* actions ********/
export const actions = () => {
  let all = [];
  let showRouteActions = false;
  if (cmdVisible()) {
    all.push({ key: 'esc', name: 'Dismiss', });
    all.push({ key: 'enter', name: 'Run Command' });
  } else if (filterVisible()) {
    all.push({ key: 'esc', name: 'Dismiss', });
    all.push({ key: 'enter', name: 'Apply' });
  } else {
    showRouteActions = true;
    all.push({ key: '˸', name: 'Command Line', });
    all.push({ key: '/', name: 'Filter', });
    all.push({ key: 'j|down', name: 'Move Down' });
    all.push({ key: 'k|up', name: 'Move Up' });
  }
  if (routeStackLen() >= 2) {
    all.push({ key: 'ctrl+p', name: 'Go Back' });
  }
  if (routeStackLen() < routeStack.length) {
    all.push({ key: 'ctrl+n', name: 'Go Forward' });
  }
  if (showRouteActions) {
    all.push(...(route().actions || []));
  }

  return all;
};
