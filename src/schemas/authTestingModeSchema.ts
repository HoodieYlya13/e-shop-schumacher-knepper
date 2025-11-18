import { z } from 'zod';

const noLeadingOrTrailingWhitespace = (val: string) =>
  val === val.trim();

export const LoginTestingModeSchema = z.object({
  password: z
    .string()
    .min(4, { message: "TOO_SHORT" })
    .refine(noLeadingOrTrailingWhitespace, {
      message: "PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE",
    }),
});

export type LoginTestingModeValues = z.infer<typeof LoginTestingModeSchema>;