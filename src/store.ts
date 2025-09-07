import { createEffect, createSignal } from "solid-js";
import { saveSession, loadSession } from "./util/session";
import './router';
import { routes as registeredRoutes } from "./route/factory/registerRoute";
import { log } from "./util/log";

export const routes = {

  stacks: {
    id: 'stacks',
    args: {},
    alias: ['stacks'],
    actions: [
      { key: 'r', name: 'Refresh' },
      { key: 'e', name: 'Events' },
      { key: 'p', name: 'Parameters' },
      { key: 'enter', name: 'Open' },
    ]
  },
  resources: {
    id: 'resources',
    alias: [] as string[],
    args: {
      stackName: '',
    },
    actions: [
      { key: 'r', name: 'Refresh' },
    ]
  },






  ...registeredRoutes,
};


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
  alias?: string[];
}) {
  const r2 = {
    id: r.id,
    args: r.args,
    actions: routes[r.id].actions,
    alias: routes[r.id].alias,
    filterPlaceholder: routes[r.id].filterPlaceholder,
  };

  if (JSON.stringify(route()) === JSON.stringify(r2)) {
    return;
  }
  routeStack = [...routeStack.slice(0, routeStackLen()), r2]
  setRouteStackLen(routeStack.length);
  setRoute(r2);

  if (r2.alias.length > 0) {
    saveSession({ lastRouteId: r2.id });
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
