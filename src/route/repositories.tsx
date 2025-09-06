import { createResource } from "solid-js";
import { awsEcrDescribeRepositories } from "../aws";
import { List } from "../ui/list";
import { Title } from "../ui/title";
import { revision, pushRoute, routes } from "../store";

export const Repositories = () => {
  const [repositories] = createResource(
    () => ({ revision: revision() }),
    () => awsEcrDescribeRepositories(),
    { initialValue: [{ repositoryName: '⏳', repositoryUri: '', createdAt: '', imageTagMutability: '' } as any] }
  );

  const onEnter = (repo: any) => {
    pushRoute({
      ...routes.Images,
      args: { repositoryName: repo.repositoryName }
    });
  };
  const repositoriesFormatted = () => repositories().map((r) => ({
    ...r,
    CreatedAt: r.createdAt?.split('T')[0],
  }));

  return (
    <box flexGrow={1}>
      <Title
        title="repositories"
        filter='all'
        count={repositories.loading ? '⏳' : repositories().length}
      />
      <List items={repositories()}
        onEnter={onEnter}
        columns={[
          { title: 'REPOSITORY NAME', render: 'repositoryName' },
          { title: 'CREATED', render: 'CreatedAt' },
          { title: 'TAG MUTABILITY', render: 'imageTagMutability' },
        ]} />
    </box>
  );
};
