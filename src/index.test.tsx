import { render, screen } from '@testing-library/react';

import Index from "./index";


describe("Index", () => {
  it("renders", () => {
    render(<Index />);
    expect(screen.getByText("Canonical ReBAC Admin")).toBeInTheDocument();
  });
});