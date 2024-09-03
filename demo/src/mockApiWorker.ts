import { setupWorker } from "msw/browser";

import { handlers } from "../../src/test/mocks/handlers";

export const mockApiWorker = setupWorker(...handlers);
