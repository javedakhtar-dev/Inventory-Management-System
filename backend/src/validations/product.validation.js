const z = require("zod");

const createProductSchema = z.object({
  name: z.string().trim().min(2).max(100),

  purchasePrice: z.number().positive(),

  sellingPrice: z.number().positive(),

  minimumStock: z.number().nonnegative(),
});

module.exports = { createProductSchema };
