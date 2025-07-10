import { z } from 'zod';

const noLeadingOrTrailingWhitespace = (val: string) =>
  val === val.trim();

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .email({ message: "INVALID_EMAIL" })
      .trim()
      .transform((val) => val.toLowerCase()),
    confirmEmail: z
      .string()
      .email({ message: "INVALID_EMAIL" })
      .trim()
      .transform((val) => val.toLowerCase()),
    password: z
      .string()
      .min(5, { message: "TOO_SHORT" })
      .max(40, { message: "TOO_LONG" })
      .refine(noLeadingOrTrailingWhitespace, {
        message: "PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE",
      }),
    confirmPassword: z
      .string()
      .min(5, { message: "TOO_SHORT" })
      .max(40, { message: "TOO_LONG" })
      .refine(noLeadingOrTrailingWhitespace, {
        message: "PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE",
      }),
    firstName: z.string().trim().min(1, { message: "REQUIRED" }).max(255, { message: "TOO_MANY_CHAR" }),
    lastName: z.string().trim().min(1, { message: "REQUIRED" }).max(255, { message: "TOO_MANY_CHAR" }),
    phone: z
      .string()
      .trim()
      .transform((val) => (val === "" ? null : val))
      .nullable()
      .optional()
      .refine((val) => !val || /^\+[1-9][0-9]{6,14}$/.test(val), {
        message: "INVALID",
      }),
    acceptsMarketing: z.boolean().default(true),
  })
  .refine((data) => data.email === data.confirmEmail, {
    path: ["confirmEmail"],
    message: "EMAIL_MISMATCH",
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "PASSWORD_MISMATCH",
  });

export const LoginSchema = z.object({
  email: z.string().email({ message: "INVALID_EMAIL" }),
  password: z
    .string()
    .min(5, { message: "TOO_SHORT" })
    .max(40, { message: "TOO_LONG" })
    .refine(noLeadingOrTrailingWhitespace, {
      message: "PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE",
    }),
});

export const PasswordRecoverySchema = z.object({
  email: z.string().email({ message: "INVALID_EMAIL" }),
});

export const ResetPasswordSchema = z
  .object({
    email: z.string().email({ message: "INVALID_EMAIL" }),
    password: z
      .string()
      .min(5, { message: "TOO_SHORT" })
      .max(40, { message: "TOO_LONG" })
      .refine(noLeadingOrTrailingWhitespace, {
        message: "PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE",
      }),
    confirmPassword: z
      .string()
      .min(5, { message: "TOO_SHORT" })
      .max(40, { message: "TOO_LONG" })
      .refine(noLeadingOrTrailingWhitespace, {
        message: "PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE",
      }),
    resetUrl: z.string().url(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "PASSWORD_MISMATCH",
  });

export type RegisterValues = z.infer<typeof RegisterSchema>;
export type LoginValues = z.infer<typeof LoginSchema>;
export type PasswordRecoveryValue = z.infer<typeof PasswordRecoverySchema>;
export type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;