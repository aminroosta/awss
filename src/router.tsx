import { createSignal, For, Match, Switch } from "solid-js";
import "./route/stacks";
import "./route/buckets";
import "./route/objects";
import "./route/resources";
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
