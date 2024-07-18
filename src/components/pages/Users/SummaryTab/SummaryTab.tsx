import { Col, Row } from "@canonical/react-components";
import { useParams } from "react-router-dom";

import { useGetIdentitiesItem } from "api/identities/identities";
import ListCard from "components/ListCard";

const SummaryTab = () => {
  const { id: userId } = useParams<{ id: string }>();
  // Loading states and errors for the user are handled in the parent component.
  const { data } = useGetIdentitiesItem(userId ?? "");
  const user = data?.data;

  return (
    <Row>
      <Col size={4}>
        <ListCard
          title="details"
          lists={[
            {
              title: "General information",
              items: [
                {
                  label: "Full name",
                  value: [user?.firstName, user?.lastName]
                    .filter(Boolean)
                    .join(" "),
                },
                {
                  label: "Email",
                  value: user?.email,
                },
              ],
            },
            {
              title: "Account details",
              items: [
                {
                  label: "Last login",
                  value: user?.lastLogin,
                },
                {
                  label: "Joined",
                  value: user?.joined,
                },
                {
                  label: "Added by",
                  value: user?.addedBy,
                },
                {
                  label: "User source",
                  value: user?.source,
                },
              ],
            },
          ]}
        />
      </Col>
    </Row>
  );
};

export default SummaryTab;
