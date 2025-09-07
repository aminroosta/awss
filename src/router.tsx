import { createSignal, For, Match, Switch } from "solid-js";
import { Stacks } from "./route/stacks";
import "./route/buckets";
import "./route/objects";
import { Resources } from "./route/resources";
import { Vpcs } from "./route/vpcs";

import "./route/instances";
import { SecurityGroups } from "./route/securitygroups";
import { Users } from "./route/users";
import "./route/stackevents";
import "./route/stackparameters";
import "./route/repositories";
import "./route/file";
import "./route/images";
import { route } from "./store";
import { RenderRoute, routes } from "./route/factory/registerRoute.tsx";

const routeIds = Object.keys(routes);

export function Router() {
  return (
    <Switch>
      <Match when={route().id === 'stacks'}>
        <Stacks />
      </Match>

      <Match when={route().id === 'resources'}>
        <Resources args={route().args as any} />
      </Match>
      <Match when={route().id === 'vpcs'}>
        <Vpcs />
      </Match>

      <Match when={route().id === 'securitygroups'}>
        <SecurityGroups />
      </Match>
      <Match when={route().id === 'users'}>
        <Users />
      </Match>
      <For each={routeIds}>
        {id =>
          <Match when={route().id === id}>
            <RenderRoute route={route()} />
          </Match>
        }
      </For>
    </Switch>
  )
}
