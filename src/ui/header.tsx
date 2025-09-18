import { awsRegion, awsCallerIdentity, awsCliVersion } from "../api";
import { getSystemUsage, usage } from "../util/system";
import { bold, TextAttributes } from "@opentui/core";
import { colors } from "../util/colors";
import { createResource, For, Index, type Accessor } from "solid-js";
import { actions, constants } from "../store";
import { chunkArray } from "../util/chunk";

const TextCaption = ({ children }: { children: any }) => {
  return (
    <text fg={colors().caption} attributes={TextAttributes.BOLD}>
      {children}
    </text>
  );
};

const Region = () => {
  const [region] = createResource(awsRegion, { initialValue: "⏳" });
  return (
    <box flexDirection="row">
      <TextCaption>Region: </TextCaption>
      <text fg={colors().fg}>{region()}</text>
    </box>
  );
};

const CallerIdentity = () => {
  const [callerIdentity] = createResource(awsCallerIdentity, {
    initialValue: { Account: "⏳", UserId: "⏳", Arn: "⏳" },
  });
  return (
    <>
      <box flexDirection="row">
        <TextCaption>Account: </TextCaption>
        <text fg={colors().fg}>{callerIdentity().Account}</text>
      </box>
      <box flexDirection="row">
        <TextCaption>User: </TextCaption>
        <text fg={colors().fg}>{callerIdentity().Arn.split("/").pop()}</text>
      </box>
    </>
  );
};

const SystemUsage = () => {
  return (
    <>
      <box flexDirection="row">
        <TextCaption>CPU: </TextCaption>
        <text fg={colors().fg}>{usage().cpu}</text>
      </box>
      <box flexDirection="row">
        <TextCaption>MEM: </TextCaption>
        <text fg={colors().fg}>{usage().mem}</text>
      </box>
    </>
  );
};

const AwsVersion = () => {
  const [version] = createResource(awsCliVersion, { initialValue: "⏳" });

  return (
    <box flexDirection="row">
      <TextCaption>AWS CLI: </TextCaption>
      <text fg={colors().fg}>{version()}</text>
    </box>
  );
};
const AwssVersion = () => {
  const [version] = createResource(awsCliVersion, { initialValue: "⏳" });

  return (
    <box flexDirection="row">
      <TextCaption>AWSS: </TextCaption>
      <text fg={colors().fg}>{process.env.APP_VERSION || "dev"}</text>
    </box>
  );
};

const Actions = () => {
  const chunks = () => chunkArray(actions(), constants.HEADER_HEIGHT);
  const key = (action: Accessor<{ key: string; name: string }>) => {
    const k = action().key;
    if (k === "return") {
      return "⏎";
    }
    // if (k.startsWith("ctrl+")) {
    //   return "C-" + k.slice(5);
    // }
    return `${k}`;
  };

  return (
    <Index each={chunks()}>
      {(chunk, index) => (
        <box flexDirection="column">
          <Index each={chunk()}>
            {(action) => (
              <box visible={action().key != ""} flexDirection="row">
                <text fg={colors().main.v700} attributes={TextAttributes.BOLD}>
                  {key(action).padEnd(index === 0 ? 7 : 2, " ")}
                </text>
                <text fg={colors().dim}>
                  {action().name.padEnd(12, " ").slice(0, 12)}
                </text>
              </box>
            )}
          </Index>
        </box>
      )}
    </Index>
  );
};
export const Header = () => {
  return (
    <box flexDirection="row" gap={6} height={constants.HEADER_HEIGHT}>
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
