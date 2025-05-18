"use client";

import * as z from "zod";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IProject } from "@/app/api/projects/route";
import { ICategory } from "@/app/api/categories/route";
import { projectSchema } from "@/components/ProjectForm/schema";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Checkbox } from "@/components/ui/checkbox";

const isFieldRequired = (fieldName: string): boolean => {
  const field =
    projectSchema.shape[fieldName as keyof typeof projectSchema.shape];
  return (
    field instanceof z.ZodString &&
    field._def.checks.some((check) => check.kind === "min")
  );
};

export type TProjectForm = z.infer<typeof projectSchema> & {
  logo_url: File | null;
  banner_url: File | null;
};

interface IProjectForm {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<TProjectForm, any, TProjectForm>;
  categoryOptions: ICategory[];
  project?: IProject;
  onSubmit: (values: TProjectForm) => void;
  formId: string;
}

export const ProjectForm: React.FC<IProjectForm> = ({
  form,
  onSubmit,
  categoryOptions,
  formId,
}) => {
  const { setValue, control } = form;

  const [logoError, setLogoError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);

  const onDropLogo = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue("logo_url", file, { shouldValidate: true });
        setLogoError(null);
      }
    },
    [setValue]
  );

  const onDropBanner = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue("banner_url", file, { shouldValidate: true });
        setBannerError(null);
      }
    },
    [setValue]
  );

  const onDropLogoRejected = useCallback((fileRejections: FileRejection[]) => {
    const errorMessages = fileRejections.map((rejection) => {
      if (rejection.errors.some((e) => e.code === "file-too-large")) {
        return "Logo must be less than 1MB";
      }
      if (rejection.errors.some((e) => e.code === "file-invalid-type")) {
        return "Invalid file type. Only JPEG, PNG, and WEBP are allowed.";
      }
      return "Invalid file.";
    });
    setLogoError(errorMessages.join(", "));
  }, []);

  const onDropBannerRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      const errorMessages = fileRejections.map((rejection) => {
        if (rejection.errors.some((e) => e.code === "file-too-large")) {
          return "Banner must be less than 2MB";
        }
        if (rejection.errors.some((e) => e.code === "file-invalid-type")) {
          return "Invalid file type. Only JPEG, PNG, and WEBP are allowed.";
        }
        return "Invalid file.";
      });
      setBannerError(errorMessages.join(", "));
    },
    []
  );

  const logoDropzone = useDropzone({
    onDrop: onDropLogo,
    onDropRejected: onDropLogoRejected,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxSize: 1 * 1024 * 1024, // 1MB
    multiple: false,
  });

  const bannerDropzone = useDropzone({
    onDrop: onDropBanner,
    onDropRejected: onDropBannerRejected,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxSize: 2 * 1024 * 1024, // 2MB
    multiple: false,
  });

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          name="name"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name{" "}
                {isFieldRequired("name") && (
                  <span className="text-red-500">*</span>
                )}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description{" "}
                {isFieldRequired("description") && (
                  <span className="text-red-500">*</span>
                )}
              </FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  rows={4}
                  maxLength={140}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>
            Project Logo <span className="text-red-500">*</span>
          </FormLabel>
          <div
            {...logoDropzone.getRootProps()}
            className={`border-dashed border-2 p-4 rounded-md cursor-pointer ${
              form.formState.errors.logo_url || logoError
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            <input {...logoDropzone.getInputProps()} />
            <p>Drag & drop a logo here, or click to select a file</p>
            <p className="text-sm text-gray-500">
              Only JPEG, JPG, PNG, WEBP (max 1MB)
            </p>
          </div>
          {form.formState.errors.logo_url && (
            <FormMessage>{form.formState.errors.logo_url.message}</FormMessage>
          )}
          {logoError && <FormMessage>{logoError}</FormMessage>}
        </FormItem>

        <FormItem>
          <FormLabel>Project Banner</FormLabel>
          <div
            {...bannerDropzone.getRootProps()}
            className={`border-dashed border-2 p-4 rounded-md cursor-pointer ${
              form.formState.errors.banner_url || bannerError
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            <input {...bannerDropzone.getInputProps()} />
            <p>Drag & drop a banner here, or click to select a file</p>
            <p className="text-sm text-gray-500">
              Only JPEG, JPG, PNG, WEBP (max 2MB)
            </p>
          </div>
          {form.formState.errors.banner_url && (
            <FormMessage>
              {form.formState.errors.banner_url.message}
            </FormMessage>
          )}
          {bannerError && <FormMessage>{bannerError}</FormMessage>}
        </FormItem>

        <FormField
          name="website"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Website{" "}
                {isFieldRequired("website") && (
                  <span className="text-red-500">*</span>
                )}
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://website.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="twitter"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Twitter <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://x.com/" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="discord"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Discord{" "}
                {isFieldRequired("discord") && (
                  <span className="text-red-500">*</span>
                )}
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://discord.gg/" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categories"
          render={() => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <div className="flex flex-wrap gap-2 max-w-sm">
                {categoryOptions.map((category) => (
                  <FormField
                    key={category.id}
                    control={form.control}
                    name="categories"
                    render={({ field }) => {
                      const isDisabled =
                        field.value?.length >= 3 &&
                        !field.value.includes(category.id);

                      return (
                        <FormItem className="flex items-center">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category.id)}
                              onCheckedChange={(checked) => {
                                if (checked && field.value.length < 3) {
                                  field.onChange([...field.value, category.id]);
                                } else if (!checked) {
                                  field.onChange(
                                    field.value?.filter(
                                      (value) => value !== category.id
                                    )
                                  );
                                }
                              }}
                              disabled={isDisabled} // Disable the checkbox dynamically
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {category.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
