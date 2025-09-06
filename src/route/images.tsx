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

  const imagesFormatted = () => images().map((i) => ({
    ...i,
    imageTag: i.imageTag || 'untagged',
    ImageDigest: i.imageDigest ? i.imageDigest.substring(7, 19) : '',
    }));

  return (
    <box flexGrow={1}>
      <Title
        title={`${args.repositoryName}/images`}
        filter='all'
        count={images.loading ? '⏳' : images().length}
      />
      <List items={imagesFormatted()}
        onEnter={onEnter}
        columns={[
          { title: 'IMAGE TAG', render: 'imageTag' },
          { title: 'IMAGE DIGEST', render: 'ImageDigest' },
        ]} />
    </box>
  );
};
