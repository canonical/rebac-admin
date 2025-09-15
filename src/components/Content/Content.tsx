import { Panel, SearchBox } from "@canonical/react-components";
import type { PropsWithChildren, ReactNode, JSX } from "react";
import { useState } from "react";

import CheckCapability from "components/CheckCapability";
import { CapabilityAction } from "hooks/capabilities";
import type { Endpoint } from "types/api";

type Props = {
  controls?: ReactNode;
  endpoint: Endpoint;
  onSearch?: (searchValue: string) => void;
  title: ReactNode;
} & PropsWithChildren;

const Content = ({
  children,
  controls,
  endpoint,
  onSearch,
  title,
  ...props
}: Props): JSX.Element => {
  const [searchValue, setSearchValue] = useState("");
  return (
    <Panel
      controls={
        <>
          <div className="l-content__controls-search">
            {onSearch ? (
              <SearchBox
                externallyControlled
                onChange={setSearchValue}
                onClear={() => onSearch("")}
                onSearch={() => onSearch(searchValue.trim())}
                value={searchValue}
              />
            ) : null}
          </div>
          <div>{controls}</div>
        </>
      }
      controlsClassName="l-content__controls"
      title={title}
    >
      <div className="l-content" {...props}>
        <CheckCapability endpoint={endpoint} action={CapabilityAction.READ}>
          {children}
        </CheckCapability>
      </div>
    </Panel>
  );
};

export default Content;
