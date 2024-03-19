import {
  Button,
  Notification,
  Spinner,
  Strip,
} from "@canonical/react-components";
import type { JSX, PropsWithChildren } from "react";

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
  const { isActionAllowed, isFetching, isRefetching, isError, error, refetch } =
    useCheckCapability(endpoint, action);

  const generateErrorContent = (error: string) => (
    <>
      Failed to check capability. {error} Try{" "}
      <Button appearance="link" onClick={refetch}>
        refetching
      </Button>{" "}
      capability.
    </>
  );

  if (isFetching && ((isFetching && isError) || (!isRefetching && !isError))) {
    return <Spinner data-testid={Label.LOADING} />;
  } else if (isError) {
    return (
      <Strip>
        <Notification severity="negative" title="Error">
          {generateErrorContent(error?.message ?? "")}
        </Notification>
      </Strip>
    );
  } else if (isActionAllowed) {
    return <>{children}</>;
  } else {
    return <h3>This feature is not enabled.</h3>;
  }
};

export default CheckCapability;
