export type FormFields = {
  confirmationMessage: string;
};

export type Props = {
  entity: string;
  count: number;
  close: () => void;
  onDelete: () => Promise<void>;
  isDeletePending: boolean;
};

export enum Label {
  CANCEL = "Cancel",
  DELETE = "Delete",
  CONFIRMATION_MESSAGE_ERROR = "Wrong confirmation message",
}
