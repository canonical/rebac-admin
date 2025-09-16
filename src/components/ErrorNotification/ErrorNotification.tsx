import { Button, Notification } from "@canonical/react-components";
import type { FC } from "react";

type Props = {
  message: string;
  error: string;
  onRefetch: () => void;
};

const ErrorNotification: FC<Props> = ({ message, error, onRefetch }: Props) => (
  <Notification severity="negative" title="Error">
    {message} {error} Try{" "}
    <Button appearance="link" onClick={onRefetch}>
      refetching
    </Button>
    .
  </Notification>
);

export default ErrorNotification;
