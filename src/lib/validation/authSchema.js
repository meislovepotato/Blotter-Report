import { z } from "zod";

// Sign Up
export const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Must be at least 8 characters")
      .regex(/[a-z]/, "At least one lowercase letter")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/\d/, "At least one number")
      .regex(/[^a-zA-Z0-9]/, "At least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// Sign In
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
