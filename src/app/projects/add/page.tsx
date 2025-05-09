"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectForm, TProjectForm } from "@/components/ProjectForm";
import { ProjectCard } from "@/components/ProjectCard";
import { projectSchema } from "@/components/ProjectForm/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ICategory } from "@/app/api/categories/route";
import { toast } from "react-toastify";
import { IPagination, IProject } from "@/app/api/projects/route";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AddProject() {
  const router = useRouter();
  const { data: categoryOptions = [], isLoading } = useQuery<ICategory[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      return res.json();
    },
  });

  const form = useForm<TProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      twitter: "",
      discord: "",
      category: "",
      logo_url: undefined,
      banner_url: null,
    },
  });

  const formValues = form.watch(); // Watch all form values in real-time

  const queryClient = useQueryClient();

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

  const { mutate: addProject, isPending } = useMutation({
    mutationFn: async (
      values: TProjectForm & { logoUrl: string; bannerUrl?: string }
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { logoUrl, bannerUrl, ...restValues } = values;

      const payload = {
        ...restValues,
        logo_url: values.logoUrl,
        banner_url: values.bannerUrl,
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message ?? "Failed to add project");
      }

      return res.json();
    },
    onSuccess: (newProject) => {
      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["projects"] });

      queries.forEach(({ queryKey }) => {
        queryClient.setQueryData(
          queryKey,
          (
            oldData:
              | {
                  pages: { projects: IProject[]; pagination: IPagination }[];
                  pageParams: Array<number>;
                }
              | undefined
          ) => {
            if (!oldData) return;

            return {
              ...oldData,
              pages: oldData.pages.map((page, index) => ({
                ...page,
                projects:
                  index === 0 ? [newProject, ...page.projects] : page.projects,
              })),
            };
          }
        );
      });

      queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast.success("Project added successfully!");

      setTimeout(() => {
        router.push(`/projects/${newProject.id}`);
      }, 1000);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });

  const onSubmit = async (values: TProjectForm) => {
    try {
      const formData = new FormData();

      if (values.logo_url) {
        formData.append("projectLogo", values.logo_url);
      }

      if (values.banner_url) {
        formData.append("projectBanner", values.banner_url);
      }

      const { logoUrl, bannerUrl } = await uploadImages(formData);

      addProject({ ...values, logoUrl, bannerUrl });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 h-screen w-screen flex items-center justify-center backdrop-blur-xs bg-black/30 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full my-[5%] gap-16 text-text-primary">
      <h1 className="mt-[64px] text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
        Add New Project
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Project Form */}
        <ProjectForm
          form={form}
          categoryOptions={categoryOptions}
          onSubmit={(values: TProjectForm) => onSubmit(values)}
          formId="add-project"
        />

        {/* Live Preview */}
        <div className="max-w-sm">
          <ProjectCard
            project={{
              id: "preview",
              status: "PENDING",
              name: formValues.name || "Project Name",
              description: formValues.description || "Project Description",
              website: formValues.website || "",
              twitter: formValues.twitter || "",
              discord: formValues.discord || "",
              categories: formValues.category
                ? [
                    {
                      id: formValues.category,
                      name:
                        categoryOptions.find(
                          (opt) => opt.id === formValues.category
                        )?.name || "Category Name",
                    },
                  ]
                : [],
              logo_url: formValues.logo_url
                ? URL.createObjectURL(formValues.logo_url)
                : "/images/monad.webp",
              banner_url: formValues.banner_url
                ? URL.createObjectURL(formValues.banner_url)
                : null,
              votes_for: 0,
              votes_against: 0,
            }}
            isPreview
          />
        </div>
        <Button
          form="add-project"
          type="submit"
          variant="secondary"
          size="lg"
          className="cursor-pointer flex-1"
          disabled={isUploadingImages || isPending}
        >
          {isUploadingImages || isPending ? (
            <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-purple-500 border-solid" />
          ) : (
            "Add Project"
          )}
        </Button>
      </div>
    </div>
  );
}
