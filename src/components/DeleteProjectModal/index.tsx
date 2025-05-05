"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IPagination, IProject } from "@/app/api/projects/route";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";
import { Spinner } from "@/components/Spinner";

interface IDeleteProjectModal {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  project: IProject;
}

export const DeleteProjectModal = ({
  isDialogOpen,
  setIsDialogOpen,
  project,
}: IDeleteProjectModal) => {
  const queryClient = useQueryClient();

  const { mutate: deleteProject, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
        body: JSON.stringify({ projectId: project.id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message ?? "Failed to delete project");
      }

      return project.id;
    },
    onSuccess: (deletedId) => {
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
          pages: oldData.pages.map((page) => ({
            ...page,
            projects: page.projects.filter((proj) => proj.id !== deletedId),
          })),
        };
      };

      queryClient.setQueryData(["projects"], updateProjects);

      queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast.success("Project deleted successfully!");
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong while deleting");
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-xs bg-black/30 z-50">
            <Spinner />
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the project{" "}
            <strong>{project.name}</strong>? This action cannot be undone, and
            all associated data will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => setIsDialogOpen(false)}
            variant="outline"
            className="cursor-pointer flex-1"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer flex-1"
            onClick={() => deleteProject()}
            disabled={isPending}
          >
            Delete Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
