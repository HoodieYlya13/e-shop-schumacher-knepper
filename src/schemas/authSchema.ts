import { z } from 'zod';

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
    password: z.string().min(5, { message: "TOO_SHORT" }),
    confirmPassword: z.string().min(5, { message: "TOO_SHORT" }),
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    phone: z
      .string()
      .trim()
      .transform((val) => (val === "" ? null : val))
      .nullable()
      .optional()
      .refine((val) => !val || /^\+?[0-9]{7,15}$/.test(val), {
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
  password: z.string().min(5, { message: "TOO_SHORT" }),
});

export const PasswordRecoverySchema = z.object({
  email: z.string().email({ message: "INVALID_EMAIL" }),
});

export const NewPasswordSchema = z.object({
  email: z.string().email({ message: "INVALID_EMAIL" }),
  password: z.string().min(5, { message: "TOO_SHORT" }),
  confirmPassword: z.string().min(5, { message: "TOO_SHORT" }),
  resetUrl: z.string().url(),
})
.refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "PASSWORD_MISMATCH",
});

export type RegisterValues = z.infer<typeof RegisterSchema>;
export type LoginValues = z.infer<typeof LoginSchema>;
export type PasswordRecoveryValue = z.infer<typeof PasswordRecoverySchema>;
export type NewPasswordValues = z.infer<typeof NewPasswordSchema>;