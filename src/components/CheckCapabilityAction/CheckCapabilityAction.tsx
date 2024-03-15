import { Spinner } from "@canonical/react-components";
import { type JSX } from "react";

import {
  useCheckCapabilityAction,
  type CapabilityActionItem,
} from "hooks/capabilities";

export enum Label {
  LOADING = "loading",
}

type Props = {
  children: JSX.Element;
  endpoint: string;
  action: CapabilityActionItem;
};

const CheckCapabilityAction = ({
  children,
  endpoint,
  action,
}: Props): JSX.Element => {
  const { isActionAllowed, isFetching, isSuccess } = useCheckCapabilityAction(
    endpoint,
    action,
  );
  if (isActionAllowed && isSuccess) {
    return <>{children}</>;
  } else if (isFetching) {
    return <Spinner data-testid={Label.LOADING} />;
  } else {
    return <h3>This feature is not enabled.</h3>;
  }
};

export default CheckCapabilityAction;
