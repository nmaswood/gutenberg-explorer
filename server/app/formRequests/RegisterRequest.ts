import { parseBodyAs, z } from "@sidebase/nuxt-parse";
import type { H3Event } from "h3";

export const registerBodySchema = z.object({
  name: z
    .string({
      required_error: "name required",
    })
    .min(1, { message: "name required" }),

  email: z
    .string({
      required_error: "valid email required",
    })
    .email({ message: "valid email required" }),

  password: z
    .string({
      required_error: "password required",
    })
    .min(8, { message: "password must be at least 8 characters" }),
});

export default async function registerRequest(event: H3Event) {
  return await parseBodyAs(event, registerBodySchema);
}
