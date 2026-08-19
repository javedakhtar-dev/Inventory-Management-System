const z = require("zod");

const nameSchema = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters")
  .max(30, "Name cannot exceed 30 characters");
const emailSchema = z.string().trim().email("Email is not valid");
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters.");

const signupInput = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

const loginInput = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const updateProfileInput = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  role: z.enum(["admin", "user"]).optional(),
});

const updatePasswordInput = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  });

module.exports = {
  signupInput,
  loginInput,
  updateProfileInput,
  updatePasswordInput,
};
