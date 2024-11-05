export enum FieldName {
  NAME = "name",
}

export type FormFields = {
  [FieldName.NAME]: string;
};

export type Props = {
  setIsDirty: (isDirty: boolean) => void;
};

export enum Label {
  NAME = "Group name",
}
