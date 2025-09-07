import { createSignal, For, Match, Switch } from "solid-js";
import { Stacks } from "./route/stacks";
import "./route/buckets";
import "./route/objects";
import { Resources } from "./route/resources";
import "./route/vpcs";

import "./route/instances";
import "./route/securitygroups";
import "./route/users";
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
