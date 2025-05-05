"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IProject } from "@/app/api/projects/route";
import { useQuery } from "@tanstack/react-query";
import { ICategory } from "@/app/api/categories/route";
import { projectSchema } from "@/components/ProjectForm/schema";

export type TProjectForm = z.infer<typeof projectSchema>;

interface IProjectForm {
  project?: IProject;
  onSubmit: (values: TProjectForm) => void;
  formId: string;
}

export const ProjectForm: React.FC<IProjectForm> = ({
  project,
  onSubmit,
  formId,
}) => {
  const { data: categoryOptions = [], isLoading } = useQuery<ICategory[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await res.json();
      return data;
    },
  });

  const form = useForm<TProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          name: project.name,
          description: project.description,
          website: project.website ?? "",
          twitter: project.twitter ?? "",
          discord: project.discord ?? "",
          github: project.github ?? "",
          status: project.status,
          category: project.categories[0]?.id ?? "",
        }
      : {
          name: "",
          description: "",
          website: "",
          twitter: "",
          discord: "",
          github: "",
          status: "PENDING",
          category: "",
        },
  });

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-xs bg-black/30 z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-solid"></div>
          </div>
        )}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="website"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://website.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="twitter"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://x.com/" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="discord"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discord</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://discord.gg/" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="github"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://github.com/" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="status"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="TRUSTABLE">TRUSTABLE</SelectItem>
                  <SelectItem value="SCAM">SCAM</SelectItem>
                  <SelectItem value="RUG">RUG</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="category"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
