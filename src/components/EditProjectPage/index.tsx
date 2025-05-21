/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectForm, TProjectForm } from "@/components/ProjectForm";
import { ProjectCard } from "@/components/ProjectCard";
import { projectSchema } from "@/components/ProjectForm/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface IEditProjectPageProps {
  project: TProjectForm & { id: string }; // Project data for editing
  categoryOptions: { id: string; name: string }[]; // Category options
}

export const EditProjectPage: React.FC<IEditProjectPageProps> = ({
  project,
  categoryOptions,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<TProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
      website: project.website ?? undefined,
      twitter: project.twitter ?? undefined,
      discord: project.discord ?? undefined,
      categories: project.categories,
      logo_url: project.logo_url as any,
      banner_url: project.banner_url as any,
    },
  });

  const formValues = form.watch(); // Watch all form values in real-time

  const { mutateAsync: uploadImages, isPending: isUploadingImages } =
    useMutation({
      mutationFn: async (formData: FormData) => {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message ?? "Upload failed");
        }

        return res.json() as Promise<{ logoUrl: string; bannerUrl?: string }>;
      },
    });

  const { mutate: updateProject, isPending } = useMutation({
    mutationFn: async (
      values: TProjectForm & {
        logoUrl: string | File;
        bannerUrl: string | File | null;
      }
    ) => {
      const { logoUrl, bannerUrl, ...restValues } = values;

      const payload = {
        ...restValues,
        logo_url: logoUrl,
        banner_url: bannerUrl,
      };

      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: project.id, project: payload }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message ?? "Failed to update project");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully!");
      router.push(`/`);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });

  const onSubmit = async (values: TProjectForm) => {
    try {
      const formData = new FormData();

      if (values.logo_url instanceof File) {
        formData.append("projectLogo", values.logo_url);
      }

      if (values.banner_url instanceof File) {
        formData.append("projectBanner", values.banner_url);
      }

      let logoUrl: string | File = project.logo_url;
      let bannerUrl: string | File | null = project.banner_url;

      if (formData.has("projectLogo") || formData.has("projectBanner")) {
        const uploadedImages = await uploadImages(formData);
        logoUrl = uploadedImages.logoUrl || logoUrl;
        bannerUrl = uploadedImages.bannerUrl || bannerUrl;
      }

      updateProject({ ...values, logoUrl, bannerUrl });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full my-[5%] gap-16 text-text-primary">
      <h1 className="mt-[64px] text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
        Edit Project
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Project Form */}
        <ProjectForm
          form={form}
          formId="edit-project"
          categoryOptions={categoryOptions}
          onSubmit={onSubmit}
          project={project as any}
        />

        {/* Live Preview */}
        <div className="max-w-sm">
          <ProjectCard
            revalidateData={async () => {}}
            project={{
              id: project.id,
              status: "PENDING",
              name: formValues.name || project.name || "Project Name",
              description:
                formValues.description || project.description || "Description",
              website: formValues.website || project.website || "",
              twitter: formValues.twitter || project.twitter || "",
              discord: formValues.discord || project.discord || "",
              categories:
                formValues.categories.length > 0
                  ? formValues.categories.map((categoryId) => {
                      if (typeof categoryId === "string") {
                        const found = categoryOptions.find(
                          (opt) => opt.id === categoryId
                        );
                        return {
                          id: categoryId,
                          name: found?.name || "Category Name",
                        };
                      }
                      // If already an object, return as is
                      return categoryId;
                    })
                  : Array.isArray(project.categories)
                  ? project.categories.map((cat) =>
                      typeof cat === "string"
                        ? {
                            id: cat,
                            name:
                              categoryOptions.find((opt) => opt.id === cat)
                                ?.name || "Category Name",
                          }
                        : cat
                    )
                  : [],
              logo_url:
                typeof formValues.logo_url === "string"
                  ? formValues.logo_url
                  : formValues.logo_url instanceof File
                  ? URL.createObjectURL(formValues.logo_url)
                  : typeof project.logo_url === "string"
                  ? project.logo_url
                  : "/images/monad.webp",
              banner_url:
                typeof formValues.banner_url === "string"
                  ? formValues.banner_url
                  : formValues.banner_url instanceof File
                  ? URL.createObjectURL(formValues.banner_url)
                  : typeof project.banner_url === "string"
                  ? project.banner_url
                  : project.banner_url === null
                  ? null
                  : undefined,
              votes_for: 0,
              votes_against: 0,
              nads_verified: false,
            }}
            isPreview
          />
        </div>
        <Button
          form="edit-project"
          type="submit"
          variant="secondary"
          size="lg"
          className="cursor-pointer flex-1"
          disabled={isUploadingImages || isPending}
        >
          {isUploadingImages || isPending ? (
            <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-purple-500 border-solid" />
          ) : (
            "Update Project"
          )}
        </Button>
      </div>
    </div>
  );
};
