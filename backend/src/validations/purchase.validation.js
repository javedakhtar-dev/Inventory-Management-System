const { z } = require("zod");

const purchaseSchema = z.object({
  supplier: z.string().optional(),
  items: z
    .array(
      z.object({
        product: z.string(),
        quantity: z.number().positive(),
        purchasePrice: z.number().nonnegative(),
      }),
    )
    .min(1),
  discount: z.number().nonnegative().optional(),
  tax: z.number().nonnegative().optional(),
  paymentStatus: z.enum(["paid", "partial", "pending"]).optional(),
});

module.exports = { purchaseSchema };
