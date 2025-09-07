import { awsEcrListImages } from "../aws";
import { registerRoute } from "./factory/registerRoute";

registerRoute({
  id: "images",
  alias: [],
  args: (a: { repositoryName: string }) => ({
    repositoryName: a.repositoryName,
  }),
  aws: ({ repositoryName }) =>
    awsEcrListImages(repositoryName).then((images) =>
      images.map((i: any) => ({
        ...i,
        imageTag: i.imageTag || "untagged",
        ImageDigest: i.imageDigest ? i.imageDigest.substring(7, 19) : "",
      })),
    ),
  title: (args) => `${args.repositoryName}/images`,
  columns: [
    { title: "IMAGE TAG", render: "imageTag" },
    { title: "IMAGE DIGEST", render: "ImageDigest" },
  ],
  keymaps: [],
});
