import { z } from "zod";

export const pricingRuleSchema = z
  .object({
    // general information
    name: z.string().trim().min(1, "Name can't be blank."),
    priority: z.coerce
      .number({ invalid_type_error: "Priority can't be blank." })
      .min(
        0,
        "Please enter an integer from 0 to 99. 0 is the highest priority.",
      )
      .max(
        100,
        "Please enter an integer from 0 to 99. 0 is the highest priority.",
      ),
    status: z.enum(["enable", "disable"], {
      errorMap: () => ({ message: "Please select a status." }),
    }),
    // apply to product
    appliedProductType: z.enum(
      ["all", "specific_products", "collections", "tags"],
      {
        required_error: "Please select a product type.",
      },
    ),
    // custom price
    priceType: z.enum(["fixed", "decrease_amount", "decrease_percentage"]),
    amount: z.coerce
      .number({ invalid_type_error: "Amount can't be blank." })
      .positive("Please enter positive amount.")
      .min(0, "Please enter a valid amount."),
  })
  .superRefine((data, ctx) => {
    if (data.priceType === "decrease_percentage" && data.amount > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter an amount between 0 and 100 for percentage.",
        path: ["amount"],
      });
    }
  });
