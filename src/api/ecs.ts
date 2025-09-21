import { aws } from "./aws";

export const awsEcsDescribeClusters = async () => {
  type ListClusters = { clusterArns: string[] };
  const list = await aws<ListClusters>(`aws ecs list-clusters`);
  if (!list.clusterArns.length) return [];

  type DescribeClusters = {
    clusters: {
      clusterArn: string;
      clusterName: string;
      status: string;
      registeredContainerInstancesCount: number;
      runningTasksCount: number;
      pendingTasksCount: number;
      activeServicesCount: number;
      statistics?: { name: string; value: string }[];
      tags?: { key: string; value: string }[];
      createdAt?: string;
    }[];
    failures?: any[];
  };
  const described = await aws<DescribeClusters>(
    `aws ecs describe-clusters --clusters ${list.clusterArns.join(
      " ",
    )} --include STATISTICS --include TAGS`,
  );
  return described.clusters.map((c) => ({
    ...c,
    registeredContainerInstancesCount: String(
      c.registeredContainerInstancesCount,
    ),
    runningTasksCount: String(c.runningTasksCount),
    pendingTasksCount: String(c.pendingTasksCount),
    pendingRunning: `${c.pendingTasksCount}/${c.runningTasksCount}`,
    activeServicesCount: String(c.activeServicesCount),
  }));
};

export const awsEcsListServices = async (clusterArn: string) => {
  type ListServices = { serviceArns: string[] };
  const list = await aws<ListServices>(
    `aws ecs list-services --cluster '${clusterArn}'`,
  );
  if (!list.serviceArns.length) return [];

  type DescribeServices = {
    services: {
      serviceArn: string;
      serviceName: string;
      status: string;
      desiredCount: number;
      runningCount: number;
      pendingCount: number;
      launchType?: string;
      platformVersion?: string;
      tags?: { key: string; value: string }[];
      createdAt?: string;
      roleArn?: string;
    }[];
    failures?: any[];
  };
  const described = await aws<DescribeServices>(
    `aws ecs describe-services --cluster '${clusterArn}' --services ${list.serviceArns.join(
      " ",
    )}`,
  );
  return described.services.map((s) => ({
    ...s,
    desiredCount: String(s.desiredCount),
    runningCount: String(s.runningCount),
    pendingRunning: `${s.pendingCount}/${s.runningCount}`,
  }));
};

export const awsEcsListTasks = async (
  clusterArn: string,
  serviceName?: string,
) => {
  type ListTasks = { taskArns: string[] };
  let list: ListTasks;
  if (serviceName) {
    list = await aws<ListTasks>(
      `aws ecs list-tasks --cluster '${clusterArn}' --service-name '${serviceName}'`,
    );
  } else {
    list = await aws<ListTasks>(`aws ecs list-tasks --cluster '${clusterArn}'`);
  }
  if (!list.taskArns.length) return [];

  type DescribeTasks = {
    tasks: {
      taskArn: string;
      taskDefinitionArn: string;
      lastStatus: string;
      desiredStatus: string;
      group: string;
      containers: {
        containerArn: string;
        lastStatus: string;
        name: string;
        exitCode?: number;
        reason?: string;
      }[];
      startedAt?: string;
      stoppedAt?: string;
      stoppedReason?: string;
      pullStartedAt?: string;
      pullStoppedAt?: string;
      connectivity?: string;
      connectivityAt?: string;
      tags?: { key: string; value: string }[];
    }[];
  };
  const described = await aws<DescribeTasks>(
    `aws ecs describe-tasks --cluster '${clusterArn}' --tasks ${list.taskArns.join(
      " ",
    )}`,
  );
  return described.tasks.map((t) => ({
    ...t,
    id: t.taskArn.split("/").pop()!,
    name: t.taskDefinitionArn.split('/').pop()!,
    lastStatus: t.lastStatus,
    desiredStatus: t.desiredStatus,
    stoppedAtReason: [t.stoppedAt, t.stoppedReason].filter(Boolean).join(" / "),
  }));
};

export const awsEcsDescribeClusterYaml = async (clusterArn: string) =>
  aws(`aws ecs describe-clusters --clusters='${clusterArn}' --query "clusters[0]"`, "yaml");

export const awsEcsTaskYaml = async (clusterArn: string, taskArn: string) =>
  aws(
    `aws ecs describe-tasks --cluster='${clusterArn}' --tasks='${taskArn}' --query "tasks[0]"`,
    "yaml",
  );

export const awsEcsTaskDefinitionYaml = async (taskDefinitionArn: string) =>
  aws(
    `aws ecs describe-task-definition --task-definition='${taskDefinitionArn}'`,
    "yaml",
  );
