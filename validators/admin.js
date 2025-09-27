const { z } = require("zod");
// Zod schema for input validation
const requiredBodySchema = z.object({
  email: z.string().email().min(6).max(100),
  password: z
    .string()
    .min(8)
    .max(12)
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$])[A-Za-z\d@#$]{8,12}$/,
      "Password must contain at least one uppercase letter, one number, and one special character (@, #, or $)"
    ),
  firstName: z.string().min(3).max(100),
  lastName: z.string().min(3).max(100),
});

const requireSigninBody = z.object({
  email: z.string().email().min(6).max(100),
  password: z
    .string()
    .min(8)
    .max(12)
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$])[A-Za-z\d@#$]{8,12}$/,
      "Password must contain at least one uppercase letter, one number, and one special character (@, #, or $)"
    ),
});

module.exports = {
  requiredBodySchema,
  requireSigninBody,
};
