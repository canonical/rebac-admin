export const generateTitle = (entity: string, isEditing?: boolean): string =>
  `${isEditing ? "Edit" : "Add"} ${entity}s`;
