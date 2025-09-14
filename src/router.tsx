import { For, Match, Switch } from "solid-js";
import "./route/stacks";
import "./route/buckets";
import "./route/objects";
import "./route/resources";
import "./route/vpcs";
import "./route/instances";
import "./route/instance_log";
import "./route/securitygroups";
import "./route/securitygroup";
import "./route/users";
import "./route/stackevents";
import "./route/stackparameters";
import "./route/repositories";
import "./route/file";
import "./route/images";
import "./route/subnets.tsx";
import "./route/subnet";
import "./route/clusters";
import { route } from "./store";
import { RenderRoute, routes } from "./route/factory/registerRoute.tsx";

export function Router() {
  return (
    <Switch>
      <For each={Object.keys(routes)}>
        {(id) => (
          <Match when={route().id === id}>
            <RenderRoute route={route()} />
          </Match>
        )}
      </For>
    </Switch>
  );
}
