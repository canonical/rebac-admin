import { setupWorker } from "msw";

import { handlers } from "./handlers";

export const mockApiWorker = setupWorker(...handlers);
