import { z } from 'zod';

export const RegisterSchema = z
  .object({
    email: z.string().email({ message: "INVALID_EMAIL" }).trim(),
    confirmEmail: z.string().email({ message: "INVALID_EMAIL" }).trim(),
    password: z.string().min(5, { message: "TOO_SHORT" }),
    confirmPassword: z.string().min(5, { message: "TOO_SHORT" }),
    firstName: z.string().min(1, { message: "REQUIRED" }).trim(),
    lastName: z.string().min(1, { message: "REQUIRED" }).trim(),
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

export const PasswordRecoverSchema = z.object({
  email: z.string().email({ message: "INVALID_EMAIL" }),
});

export type RegisterValues = z.infer<typeof RegisterSchema>;
export type LoginValues = z.infer<typeof LoginSchema>;
export type PasswordRecoverValue = z.infer<typeof PasswordRecoverSchema>;