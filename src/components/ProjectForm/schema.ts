import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
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
  github: z
    .string()
    .url("Invalid URL, it must start with https://")
    .optional()
    .or(z.literal(""))
    .refine((url) => url === "" || url?.startsWith("https://github.com/"), {
      message: "GitHub must start with https://github.com/",
    }),
  status: z.enum(["PENDING", "TRUSTABLE", "SCAM", "RUG"]),
  category: z.string().min(1, "Category is required"),
});
