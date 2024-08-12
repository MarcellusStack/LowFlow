import { Permission } from "@prisma/client";

type User = {
  permissions: Permission[];
};

export const getReadPermissions = (
  user: User,
  entityType: "workflow" | "process"
) => {
  const canReadAll = user.permissions.some(
    (permission) =>
      (entityType === "workflow"
        ? permission.readWorkflow
        : permission.readProcess) &&
      (entityType === "workflow"
        ? permission.workflows?.length === 0
        : permission.processes?.length === 0)
  );

  const specificEntityIds = user.permissions
    .filter(
      (permission) =>
        (entityType === "workflow"
          ? permission.readWorkflow
          : permission.readProcess) &&
        (entityType === "workflow"
          ? permission.workflows?.length > 0
          : permission.processes?.length > 0)
    )
    .flatMap((permission) =>
      entityType === "workflow"
        ? permission.workflows?.map((workflow) => workflow.id) || []
        : permission.processes?.map((process) => process.id) || []
    );

  return { canReadAll, specificEntityIds };
};
