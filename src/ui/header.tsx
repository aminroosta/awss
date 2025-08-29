import { awsRegion, awsCallerIdentity, awsCliVersion } from "../aws";
import { getSystemUsage, usage } from "../util/system";
import { TextAttributes } from "@opentui/core";
import { colors } from "../util/colors";
import { createResource } from "solid-js";

const TextInfo = ({ children }: { children: any }) => {
  return <text fg={colors().info} attributes={TextAttributes.BOLD}>{children}</text>
}

const Region = () => {
  const [region] = createResource(awsRegion, { initialValue: '...' });
  return (
    <box flexDirection="row">
      <TextInfo>Region:  </TextInfo>
      <text>{region()}</text>
    </box>
  )
}

const CallerIdentity = () => {
  const [callerIdentity] = createResource(awsCallerIdentity, { initialValue: { Account: '...', UserId: '...', Arn: '...' } });
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
  const [version] = createResource(awsCliVersion, { initialValue: '...' });

  return (
    <box flexDirection="row">
      <TextInfo>AWS CLI: </TextInfo>
      <text>{version()}</text>
    </box>
  );
}

export const Header = () => {
  return (
    <box height={7}>
      <Region />
      <CallerIdentity />
      <AwsVersion />
      <SystemUsage />
    </box>
  );
};
