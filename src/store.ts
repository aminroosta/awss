import { log } from "./util/log";
import { createSignal } from "solid-js";

export const routes = {
  Buckets: {
    id: 'buckets',
    args: {},
    alias: ['s3', 'buckets']
  },
  Stacks: {
    id: 'stacks',
    args: {},
    alias: ['stacks', 'cloudformation']
  },
  Objects: {
    id: 'objects',
    alias: [] as string[],
    args: {
      bucket: '',
      prefix: '',
    }
  }
};
export const [cmdVisible, setCmdVisible] = createSignal(false);

export const constants = {
  HEADER_HEIGHT: 7,
  CMDLINE_HEIGHT: 3,
}

//------- route management -------//
const initialRoute = routes.Buckets;
let routeStack = [initialRoute];
let routeStackLen = 1;
export const [route, setRoute] = createSignal(initialRoute);

export function pushRoute(r: {
  id: string;
  args: { [key: string]: any };
  alias: string[];
}) {
  if (JSON.stringify(route()) === JSON.stringify(r)) {
    return;
  }
  routeStack = [...routeStack.slice(0, routeStackLen), r]
  routeStackLen = routeStack.length;
  setRoute(r);
}
export function popRoute() {
  if (routeStackLen >= 2) {
    routeStackLen -= 1;
    setRoute(routeStack[routeStackLen - 1]!);
  }
}
export function undoPopRoute() {
  if (routeStackLen < routeStack.length) {
    routeStackLen += 1;
    setRoute(routeStack[routeStackLen - 1]!);
  }
}

