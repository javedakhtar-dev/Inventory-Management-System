const { z } = require("zod");

const saleSchema = z.object({
  customer: z.string().optional(),
  items: z
    .array(
      z.object({
        product: z.string(),
        quantity: z.number().positive(),
        sellingPrice: z.number().nonnegative().optional(),
      }),
    )
    .min(1),
  discount: z.number().nonnegative().optional(),
  tax: z.number().nonnegative().optional(),
  paymentMethod: z.enum(["cash", "card", "upi", "bank"]).optional(),
});

module.exports = { saleSchema };
