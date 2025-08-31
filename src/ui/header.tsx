import { awsRegion, awsCallerIdentity, awsCliVersion } from "../aws";
import { getSystemUsage, usage } from "../util/system";
import { TextAttributes } from "@opentui/core";
import { colors } from "../util/colors";
import { createResource, For } from "solid-js";
import { actions, constants } from "../store";
import { chunkArray } from "../util/chunk";

const TextInfo = ({ children }: { children: any }) => {
  return <text fg={colors().info} attributes={TextAttributes.BOLD}>{children}</text>
}

const Region = () => {
  const [region] = createResource(awsRegion, { initialValue: '⏳' });
  return (
    <box flexDirection="row">
      <TextInfo>Region:  </TextInfo>
      <text>{region()}</text>
    </box>
  )
}

const CallerIdentity = () => {
  const [callerIdentity] = createResource(awsCallerIdentity, { initialValue: { Account: '⏳', UserId: '⏳', Arn: '⏳' } });
  return (
    <>
      <box flexDirection="row">
        <TextInfo>Account: </TextInfo>
        <text>{callerIdentity().Account}</text>
      </box>
      <box flexDirection="row">
        <TextInfo>UserId:  </TextInfo>
        <text>{callerIdentity().UserId.split(':')[0]}</text>
      </box>
      <box flexDirection="row">
        <TextInfo>User:    </TextInfo>
        <text>{callerIdentity().Arn.split('/').pop()}</text>
      </box>
    </>
  );
}

const SystemUsage = () => {

  return (
    <>
      <box flexDirection="row">
        <TextInfo>CPU:     </TextInfo>
        <text>{usage().cpu}</text>
      </box>
      <box flexDirection="row">
        <TextInfo>MEM:     </TextInfo>
        <text>{usage().mem}</text>
      </box>
    </>
  );
}

const AwsVersion = () => {
  const [version] = createResource(awsCliVersion, { initialValue: '⏳' });

  return (
    <box flexDirection="row">
      <TextInfo>AWS CLI: </TextInfo>
      <text>{version()}</text>
    </box>
  );
}

const Actions = () => {
  const chunks = () => chunkArray(actions(), constants.HEADER_HEIGHT);

  // const key = (action: {key: string}) => {
  //   return 
  // };

  return (
    <For each={chunks()}>
      {chunk => (
        <box flexDirection="column">
          <For each={chunk}>
            {action => (
              <box flexDirection="row">
                <text fg={colors().primary}>{`<${action.key}>  `}</text>
                <text fg={colors().dim}>{action.name}</text>
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
        <SystemUsage />
      </box>
      <Actions />
    </box>
  );
};
