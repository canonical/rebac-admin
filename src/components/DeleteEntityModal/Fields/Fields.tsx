import { Col, Row, FormikField } from "@canonical/react-components";
import { useFormikContext } from "formik";
import type { FC } from "react";
import { useEffect } from "react";

import type { FormFields } from "../types";

import type { Props } from "./types";

const Fields: FC<Props> = ({
  confirmationMessage,
  entity,
  entityCount,
  setIsValid,
}: Props) => {
  const { dirty, isValid } = useFormikContext<FormFields>();

  useEffect(() => {
    setIsValid(!!dirty && isValid);
  }, [dirty, isValid, setIsValid]);

  return (
    <Row>
      <Col size={12}>
        <p>
          Are you sure you want to delete {entityCount}? The deletion of{" "}
          {entity}s is irreversible and might adversely affect your system.
        </p>
      </Col>
      <Col size={12}>
        <FormikField
          label={
            <Col size={12}>
              Type <b>{confirmationMessage}</b> to confirm.
            </Col>
          }
          name="confirmationMessage"
          type="text"
          takeFocus
        />
      </Col>
    </Row>
  );
};

export default Fields;
