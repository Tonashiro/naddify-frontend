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

  const { mutate: addProject, isPending } = useMutation({
    mutationFn: async (values: TProjectForm) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message ?? "Failed to add project");
      }

      return res.json();
    },
    onSuccess: (newProject) => {
      const updateProjects = (
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
      };

      queryClient.setQueryData(["projects"], updateProjects);

      queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast.success("Project added successfully!");
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });

  const handleSubmit = (values: TProjectForm) => {
    addProject(values);
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
