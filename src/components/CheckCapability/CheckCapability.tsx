import { Notification, Spinner } from "@canonical/react-components";
import type { JSX, PropsWithChildren } from "react";

import ErrorNotification from "components/ErrorNotification";
import { useCheckCapability, type CapabilityAction } from "hooks/capabilities";
import type { Endpoint } from "types/api";

import { Label } from "./types";

type Props = {
  endpoint: Endpoint;
  action: CapabilityAction;
} & PropsWithChildren;

const CheckCapability = ({
  children,
  endpoint,
  action,
}: Props): JSX.Element => {
  const { hasCapability, isFetching, isError, error, refetch } =
    useCheckCapability(endpoint, action);

  // Display the spinner for the initial query and for any subsequent queries
  // that follow a failed one.
  if (isFetching) {
    return <Spinner data-testid={Label.LOADING} />;
  } else if (isError) {
    return (
      <ErrorNotification
        message={Label.CHECK_CAPABILITY_ERROR}
        error={error?.message ?? ""}
        onRefetch={() => void refetch()}
      />
    );
  } else if (hasCapability) {
    return <>{children}</>;
  } else {
    return (
      <Notification severity="caution">{Label.DISABLED_FEATURE}</Notification>
    );
  }
};

export default CheckCapability;
