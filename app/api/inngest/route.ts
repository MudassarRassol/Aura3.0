import { serve } from "inngest/next";
import { inngest as inngest } from "../../../inngest/client";
import { functions as inngestFunctions } from "../../../inngest/functions/function";
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: inngestFunctions,
});