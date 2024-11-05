export type Props = {
  setIsDirty: (value: boolean) => void;
};

export enum FieldName {
  EMAIL = "email",
  FIRST_NAME = "firstName",
  LAST_NAME = "lastName",
}

export enum Label {
  EMAIL = "Email",
  FIRST_NAME = "First name (optional)",
  LAST_NAME = "Last name (optional)",
}

export type FormFields = {
  [FieldName.EMAIL]: string;
  [FieldName.FIRST_NAME]?: string;
  [FieldName.LAST_NAME]?: string;
};
