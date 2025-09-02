import { Match, Switch } from "solid-js";
import { Stacks } from "./route/stacks";
import { Buckets } from "./route/buckets";
import { S3Objects } from "./route/s3objects";
import { Resources } from "./route/resources";
import { Vpcs } from "./route/vpcs";
import { Repositories } from "./route/repositories";
import { Images } from "./route/images";
import { Instances } from "./route/instances";
import { SecurityGroups } from "./route/securitygroups";
import { Users } from "./route/users";
import { route } from "./store";

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
        <S3Objects args={route().args as any} />
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
    </Switch>
  )
}
