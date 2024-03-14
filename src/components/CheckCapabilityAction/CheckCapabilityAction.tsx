import { Spinner } from "@canonical/react-components";
import { type JSX } from "react";

import {
  useCheckCapabilityAction,
  type CapabilityActionItem,
} from "hooks/capabilities";

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
  if (isFetching) {
    return (
      <Spinner text={`Checking if ${action} ${endpoint} can be performed...`} />
    );
  } else if (isActionAllowed && isSuccess) {
    return <>{children}</>;
  } else {
    return <h3>{`Can't ${action} ${endpoint}!`}</h3>;
  }
};

export default CheckCapabilityAction;
