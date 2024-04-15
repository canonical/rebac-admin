export const generateTitle = (entity: string, isEditing?: boolean) =>
  `${isEditing ? "Edit" : "Add"} ${entity}s`;
