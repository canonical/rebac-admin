import { queries, within } from "@testing-library/react";

import * as tableQueries from "./tables";

export const customWithin = (element: HTMLElement) =>
  within(element, { ...queries, ...tableQueries });
