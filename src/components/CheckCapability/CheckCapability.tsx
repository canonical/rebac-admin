import { Spinner } from "@canonical/react-components";
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
  const { isAllowed, isFetching, isPending, isError, error, refetch } =
    useCheckCapability(endpoint, action);

  // Display the spinner for the initial query and for any subsequent queries
  // that follow a failed one.
  if (isFetching && (isPending || (!isPending && isError))) {
    return <Spinner data-testid={Label.LOADING} />;
  } else if (isError) {
    return (
      <ErrorNotification
        message={Label.ERROR_MESSAGE}
        error={error?.message ?? ""}
        onClick={() => void refetch()}
      />
    );
  } else if (isAllowed) {
    return <>{children}</>;
  } else {
    return <h3>This feature is not enabled.</h3>;
  }
};

export default CheckCapability;
