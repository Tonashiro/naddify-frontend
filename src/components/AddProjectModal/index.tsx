"use client";

import { IPagination, IProject } from "@/app/api/projects/route";
import { ProjectForm, TProjectForm } from "@/components/ProjectForm";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

interface IAddProjectModal {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const AddProjectModal: React.FC<IAddProjectModal> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: uploadImages } = useMutation({
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
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });

  const handleSubmit = async (values: TProjectForm) => {
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

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => setIsModalOpen(open)}>
      <DialogContent className="sm:max-w-[600px]">
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-xs bg-black/30 z-50">
            <Spinner />
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new project to your list. Provide
            all the necessary details to get started.
          </DialogDescription>
        </DialogHeader>
        <ProjectForm onSubmit={handleSubmit} formId="add-project" />
        <div className="flex gap-2">
          <Button
            onClick={() => setIsModalOpen(false)}
            variant="outline"
            className="cursor-pointer flex-1"
          >
            Cancel
          </Button>
          <Button
            form="add-project"
            type="submit"
            variant="secondary"
            className="cursor-pointer flex-1"
          >
            Add Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
