import { render, screen } from "@testing-library/react";

import ReBACAdmin from "./ReBACAdmin";

describe("ReBACAdmin", () => {
  it("renders", () => {
    render(<ReBACAdmin />);
    expect(screen.getByText("Canonical ReBAC Admin")).toBeInTheDocument();
  });
});
