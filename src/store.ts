import { createSignal } from "solid-js";

export const routes = {
  Buckets: {
    id: 'buckets',
    title: ' Buckets ',
    alias: ['s3', 'buckets']
  },
  Stacks: {
    id: 'stacks',
    title: ' Stacks ',
    alias: ['stacks', 'cloudformation']
  }
};

export const [route, setRoute] = createSignal(routes.Stacks);

export const [cmdVisible, setCmdVisible] = createSignal(false);
