import { awsRegion, awsCallerIdentity, awsCliVersion } from "../aws";
import { getSystemUsage, usage } from "../util/system";
import { TextAttributes } from "@opentui/core";
import { colors } from "../util/colors";
import { createResource, For } from "solid-js";
import { actions, constants } from "../store";
import { chunkArray } from "../util/chunk";

const TextCaption = ({ children }: { children: any }) => {
  return <text fg={colors().caption} attributes={TextAttributes.BOLD}>{children}</text>
}

const Region = () => {
  const [region] = createResource(awsRegion, { initialValue: '⏳' });
  return (
    <box flexDirection="row">
      <TextCaption>Region:  </TextCaption>
      <text>{region()}</text>
    </box>
  )
}

const CallerIdentity = () => {
  const [callerIdentity] = createResource(awsCallerIdentity, { initialValue: { Account: '⏳', UserId: '⏳', Arn: '⏳' } });
  return (
    <>
      <box flexDirection="row">
        <TextCaption>Account: </TextCaption>
        <text>{callerIdentity().Account}</text>
      </box>
      <box flexDirection="row">
        <TextCaption>User:    </TextCaption>
        <text>{callerIdentity().Arn.split('/').pop()}</text>
      </box>
    </>
  );
}

const SystemUsage = () => {

  return (
    <>
      <box flexDirection="row">
        <TextCaption>CPU:     </TextCaption>
        <text>{usage().cpu}</text>
      </box>
      <box flexDirection="row">
        <TextCaption>MEM:     </TextCaption>
        <text>{usage().mem}</text>
      </box>
    </>
  );
}

const AwsVersion = () => {
  const [version] = createResource(awsCliVersion, { initialValue: '⏳' });

  return (
    <box flexDirection="row">
      <TextCaption>AWS CLI: </TextCaption>
      <text>{version()}</text>
    </box>
  );
}
const AwssVersion = () => {
  const [version] = createResource(awsCliVersion, { initialValue: '⏳' });

  return (
    <box flexDirection="row">
      <TextCaption>AWSS: </TextCaption>
      <text>{process.env.APP_VERSION || "dev"}</text>
    </box>
  );
}

const Actions = () => {
  const chunks = () => chunkArray(actions(), constants.HEADER_HEIGHT);

  return (
    <For each={chunks()}>
      {chunk => (
        <box flexDirection="column">
          <For each={chunk}>
            {action => (
              <box flexDirection="row">
                <text fg={colors().primary}>{`<${action.key}>`.padEnd(10, ' ')}</text>
                <text fg={colors().dim}>{action.name.padEnd(12, ' ').slice(0, 12)}</text>
              </box>
            )}
          </For>
        </box>
      )}
    </For>
  );
};
export const Header = () => {
  return (
    <box flexDirection="row" gap={8} height={constants.HEADER_HEIGHT}>
      <box>
        <Region />
        <CallerIdentity />
        <AwsVersion />
        <AwssVersion />
        <SystemUsage />
      </box>
      <Actions />
    </box>
  );
};
