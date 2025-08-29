import { createSignal } from "solid-js";
import { Buckets } from "./route/buckets";
import { Stacks } from "./route/stacks";

export const routes = {
  Buckets: {
    component: Buckets,
    title: ' Buckets ',
    alias: ['s3', 'buckets']
  },
  Stacks: {
    component: Stacks,
    title: ' Stacks ',
    alias: ['stacks', 'cloudformation']
  }
};

export const [route, setRoute] = createSignal(routes.Stacks)
