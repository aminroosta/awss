import { createResource } from "solid-js";
import { awsEcrListImages } from "../aws";
import { List } from "../ui/list";
import { Title } from "../ui/title";
import { revision } from "../store";

export const Images = ({ args }: { args: { repositoryName: string } }) => {
  const [images] = createResource(
    () => ({ revision: revision() }),
    () => awsEcrListImages(args.repositoryName),
    { initialValue: [{ imageTag: '⏳', imageDigest: '' } as any] }
  );

  const onEnter = (image: any) => {
    console.log(image);
  };

  return (
    <box flexGrow={1}>
      <Title
        title={`${args.repositoryName}/images`}
        filter='all'
        count={images.loading ? '⏳' : images().length}
      />
      <List items={images()}
        onEnter={onEnter}
        columns={[
          { title: 'IMAGE TAG', render: (image: any) => image.imageTag || 'untagged' },
          { title: 'IMAGE DIGEST', render: (image: any) => image.imageDigest ? image.imageDigest.slice(7, 19) : '' },
        ]} />
    </box>
  );
};
