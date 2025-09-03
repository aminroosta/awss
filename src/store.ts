import { log } from "./util/log";
import { createSignal } from "solid-js";
import { saveSession, loadSession } from "./util/session";

export const routes = {
  Buckets: {
    id: 'buckets',
    args: {},
    alias: ['s3', 'buckets'],
    actions: [
      { key: 'r', name: 'Refresh' },
      { key: 'enter', name: 'Open Bucket' },
    ]
  },
  Stacks: {
    id: 'stacks',
    args: {},
    alias: ['stacks'],
    actions: [
      { key: 'r', name: 'Refresh' },
      { key: 'enter', name: 'Open' },
    ]
  },
  Resources: {
    id: 'resources',
    alias: [] as string[],
    args: {
      stackName: '',
    },
    actions: [
      { key: 'r', name: 'Refresh' },
    ]
  },
  Objects: {
    id: 'objects',
    alias: [] as string[],
    args: {
      bucket: '',
      prefix: '',
    },
    actions: [
      { key: 'r', name: 'Refresh' },
      { key: 'enter', name: 'Open Object / Dir' },
    ]
  },
  Vpcs: {
    id: 'vpcs',
    args: {},
    alias: ['vpcs'],
    actions: [
      { key: 'r', name: 'Refresh' },
      { key: 'enter', name: 'Open Browser' },
    ]
  },
  Repositories: {
    id: 'repositories',
    args: {},
    alias: ['repos', 'repositories'],
    actions: [
      { key: 'r', name: 'Refresh' },
      { key: 'enter', name: 'Open' },
    ]
  },
  Images: {
    id: 'images',
    alias: [] as string[],
    args: {
      repositoryName: '',
    },
    actions: [
      { key: 'r', name: 'Refresh' },
    ]
  },
  Instances: {
    id: 'instances',
    args: {},
    alias: ['ec2', 'instances'],
    actions: [
      { key: 'r', name: 'Refresh' },
      { key: 'enter', name: 'Open Browser' },
    ]
  },
  SecurityGroups: {
    id: 'securitygroups',
    args: {},
    alias: ['sgs', 'securitygroups'],
    actions: [
      { key: 'r', name: 'Refresh' },
      { key: 'enter', name: 'Open Browser' },
    ]
  },
  Users: {
    id: 'users',
    args: {},
    alias: ['users'],
    actions: [
      { key: 'r', name: 'Refresh' },
      { key: 'enter', name: 'Open Browser' },
    ]
  }
};
export const [cmdVisible, setCmdVisible] = createSignal(false);
export const [revision, setRevision] = createSignal(1);

export const constants = {
  HEADER_HEIGHT: 7,
  CMDLINE_HEIGHT: 3,
}

/******** route management ********/
const initialRoute = loadSession().lastRoute || routes.Buckets;
let routeStack = [initialRoute];
let [routeStackLen, setRouteStackLen] = createSignal(1);
export const [route, setRoute] = createSignal(initialRoute);

export function pushRoute(r: {
  id: string;
  args: { [key: string]: any };
  alias: string[];
}) {
  if (JSON.stringify(route()) === JSON.stringify(r)) {
    return;
  }
  routeStack = [...routeStack.slice(0, routeStackLen()), r]
  setRouteStackLen(routeStack.length);
  setRoute(r);
  
  // if (r.alias.length > 0) {
    saveSession({ lastRoute: r });
  // }
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

/********* modal management ********/
export const modals = {
  File: {
    id: 'file',
    args: {
      bucket: '',
      key: '',
      title: ''
    }
  }
};
export const [modal, setModal] = createSignal<{ id: string, args: { title: string } & object }>(null as any);

/********* notifications *********/
type Notification = { message: string; level: 'info' | 'warn' | 'error'; timeout: number } | null;
export const [notification, setNotification] = createSignal<Notification>(null);

/********* actions ********/
export const actions = () => {
  let all = [];
  if (cmdVisible()) {
    all.push({ key: 'esc', name: 'Dismiss', });
    all.push({ key: 'enter', name: 'Run Command' });
  } else {
    all.push({ key: '˸', name: 'Command Line', });
    all.push({ key: 'j|down', name: 'Move Down' });
    all.push({ key: 'k|up', name: 'Move Up' });
  }
  if (routeStackLen() >= 2) {
    all.push({ key: 'esc', name: 'Go Back' });
  }
  if (routeStackLen() < routeStack.length) {
    all.push({ key: 'ctrl+n', name: 'Go Forward' });
  }
  all.push(...(route().actions || []));

  return all;
};
