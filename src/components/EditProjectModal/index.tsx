"use client";

import { IPagination, IProject } from "@/app/api/projects/route";
import { ProjectForm, TProjectForm } from "@/components/ProjectForm";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

interface IEditProjectModal {
  project: IProject;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditProjectModal: React.FC<IEditProjectModal> = ({
  project,
  isModalOpen,
  setIsModalOpen,
}) => {
  const queryClient = useQueryClient();

  const { mutate: editProject, isPending } = useMutation({
    mutationFn: async (values: TProjectForm) => {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project: values, projectId: project.id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message ?? "Failed to add project");
      }

      return res.json();
    },
    onSuccess: (updatedProject) => {
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
              pages: oldData.pages.map((page) => ({
                ...page,
                projects: page.projects.map((proj) =>
                  proj.id === updatedProject.id ? updatedProject : proj
                ),
              })),
            };
          }
        );
      });

      // Optionally invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast.success("Project updated successfully!");
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong!");
    },
  });

  const handleSubmit = (values: TProjectForm) => {
    editProject(values);
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
          <DialogTitle>{project.name}</DialogTitle>
        </DialogHeader>
        <ProjectForm
          project={project}
          onSubmit={handleSubmit}
          formId="edit-project"
        />
        <div className="flex gap-2">
          <Button
            onClick={() => setIsModalOpen(false)}
            variant="outline"
            className="cursor-pointer flex-1"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            form="edit-project"
            type="submit"
            variant="secondary"
            className="cursor-pointer flex-1"
            disabled={isPending}
          >
            Update Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
