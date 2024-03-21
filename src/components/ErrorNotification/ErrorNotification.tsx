import { Button, Notification } from "@canonical/react-components";

type Props = {
  message: string;
  error: string;
  onRefetch: () => void;
};

const ErrorNotification = ({ message, error, onRefetch }: Props) => (
  <Notification severity="negative" title="Error">
    {message} {error} Try{" "}
    <Button appearance="link" onClick={onRefetch}>
      refetching
    </Button>
    .
  </Notification>
);

export default ErrorNotification;
