import z from "zod";

export const adminUsersSearchSchema = z.object({
  q: z.string().optional(),
  page: z.coerce
    .number()
    .int()
    .min(1, { message: "Page must be greater than 0" })
    .default(1),
  size: z.coerce
    .number()
    .int()
    .min(1, { message: "Size must be greater than 0" })
    .max(100, { message: "Size must be 100 or less" })
    .default(10),
});
