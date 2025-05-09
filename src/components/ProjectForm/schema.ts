import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(140, "Description must be less than 140 characters"),
  website: z
    .string()
    .url("Website must start with https://")
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .url("Invalid URL, it must start with https://")
    .refine((url) => url.startsWith("https://x.com/"), {
      message: "Twitter must start with https://x.com/",
    }),
  discord: z
    .string()
    .url("Invalid URL, it must start with https://")
    .optional()
    .or(z.literal(""))
    .refine((url) => url === "" || url?.startsWith("https://discord.gg/"), {
      message: "Discord must start with https://discord.gg/",
    }),
  category: z.string().min(1, "Category is required"),
  logo_url: z
    .instanceof(File, { message: "Logo is required" })
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "Logo must be less than 1MB",
    }),
  banner_url: z.instanceof(File).nullable(),
});
