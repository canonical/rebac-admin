import { Button, Notification, Strip } from "@canonical/react-components";

type Props = {
  message: string;
  error: string;
  onClick: () => void;
};

const ErrorNotification = ({ message, error, onClick }: Props) => (
  <Strip>
    <Notification severity="negative" title="Error">
      {message} {error} Try{" "}
      <Button appearance="link" onClick={onClick}>
        refetching
      </Button>
      .
    </Notification>
  </Strip>
);

export default ErrorNotification;
