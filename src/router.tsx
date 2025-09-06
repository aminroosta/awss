import { createSignal, Match, Switch } from "solid-js";
import { Stacks } from "./route/stacks";
import { Buckets } from "./route/buckets";
import { Objects } from "./route/objects";
import { Resources } from "./route/resources";
import { Vpcs } from "./route/vpcs";
import { Repositories } from "./route/repositories";
import { Images } from "./route/images";
import { Instances } from "./route/instances";
import { SecurityGroups } from "./route/securitygroups";
import { Users } from "./route/users";
import { StackEvents } from "./route/stackevents";
import "./route/stackparameters";
import { File } from "./route/file.tsx";
import { route } from "./store";
import { RenderRoute, routes } from "./route/factory/registerRoute.tsx";

const routeIds = Object.keys(routes);

export function Router() {
  return (
    <Switch>
      <Match when={route().id === 'stacks'}>
        <Stacks />
      </Match>
      <Match when={route().id === 'buckets'}>
        <Buckets />
      </Match>
      <Match when={route().id === 'objects'}>
        <Objects args={route().args as any} />
      </Match>
      <Match when={route().id === 'resources'}>
        <Resources args={route().args as any} />
      </Match>
      <Match when={route().id === 'vpcs'}>
        <Vpcs />
      </Match>
      <Match when={route().id === 'repositories'}>
        <Repositories />
      </Match>
      <Match when={route().id === 'images'}>
        <Images args={route().args as any} />
      </Match>
      <Match when={route().id === 'instances'}>
        <Instances />
      </Match>
      <Match when={route().id === 'securitygroups'}>
        <SecurityGroups />
      </Match>
      <Match when={route().id === 'users'}>
        <Users />
      </Match>
      <Match when={route().id === 'stackevents'}>
        <StackEvents args={route().args as any} />
      </Match>
      <Match when={route().id === 'file'}>
        <File args={route().args as any} />
      </Match>
      <Match when={routeIds.includes(route().id)}>
        <RenderRoute route={route()} />
      </Match>
    </Switch>
  )
}
