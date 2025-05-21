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
  categories: z
    .array(z.string())
    .min(1, "At least one category is required")
    .max(3, "You can select up to 3 categories"),
  logo_url: z
    .union([
      z.instanceof(File, { message: "Logo must be a file" }),
      z.string(), // Allow existing logo URLs
    ])
    .refine(
      (value) =>
        typeof value === "string" ||
        (value instanceof File && value.size <= 1 * 1024 * 1024),
      {
        message: "Logo must be less than 1MB",
      }
    ),
  banner_url: z
    .union([
      z.instanceof(File, { message: "Banner must be a file" }),
      z.string().nullable(), // Allow existing banner URLs or null
    ])
    .refine(
      (value) =>
        value === null ||
        typeof value === "string" ||
        (value instanceof File && value.size <= 2 * 1024 * 1024),
      {
        message: "Banner must be less than 2MB",
      }
    ),
});
