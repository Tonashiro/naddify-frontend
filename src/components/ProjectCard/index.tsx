"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { Website } from "@/components/Icons/Website";
import { Discord } from "@/components/Icons/Discord";
import { Twitter } from "@/components/Icons/Twitter";
import ProjectCTA from "@/components/ProjectCTA";
import { VoteButton } from "@/components/VoteButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IPagination, IProject } from "@/app/api/projects/route";
import { useUserContext } from "@/contexts/userContext";
import { EditProjectModal } from "@/components/EditProjectModal";
import { Trash2, Settings } from "lucide-react"; // Import the Cog icon from Lucide
import { DeleteProjectModal } from "@/components/DeleteProjectModal";

export interface IProjectCard {
  project: IProject & {
    logoUrl: string;
  };
}

/**
 * The `ProjectCard` component displays detailed information about a project in a card format.
 *
 * ### Features:
 * - **Project Details**:
 *   - Displays the project name, description, logo, and category.
 *   - Includes links to the project's website, Twitter, Discord, and GitHub (if available).
 * - **Voting System**:
 *   - Allows users to vote "FOR" or "AGAINST" a project.
 *   - Updates the vote count dynamically using React Query.
 * - **Admin Actions**:
 *   - If the user is an admin, displays buttons to edit or delete the project.
 *   - Opens the `EditProjectModal` or `DeleteProjectModal` when the respective button is clicked.
 * - **Responsive Design**:
 *   - Styled using Tailwind CSS for responsiveness and modern UI effects.
 *   - Includes hover effects and transitions for better user experience.
 *
 * ### Props:
 * - `project`: The project data to display, including its details and metadata.
 *
 * ### Dependencies:
 * - Uses `react-query` for data mutations and cache updates.
 * - Uses `react-toastify` for displaying success and error messages.
 * - Integrates with `EditProjectModal` and `DeleteProjectModal` for admin actions.
 *
 * ### Example:
 * ```tsx
 * <ProjectCard project={projectData} />
 * ```
 *
 * @param props - The props for the `ProjectCard` component.
 * @returns A JSX element representing the project card.
 */
export const ProjectCard: React.FC<IProjectCard> = ({ project }) => {
  const [pendingVote, setPendingVote] = useState<"FOR" | "AGAINST" | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user, connectDiscord } = useUserContext();

  const { mutate } = useMutation({
    mutationFn: async (voteType: "FOR" | "AGAINST") => {
      if (!user) {
        connectDiscord();
        return;
      }

      setPendingVote(voteType);
      const res = await fetch(`/api/votes/${project.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteType, projectId: project.id }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message ?? "Voting failed");
        throw new Error(error.message ?? "Voting failed");
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Vote submitted successfully!");
      const { project_id } = data.vote;
      const { votesFor, votesAgainst } = data.stats;

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
            projects: page.projects.map((project) =>
              project.id === project_id
                ? {
                    ...project,
                    votes_for: votesFor,
                    votes_against: votesAgainst,
                  }
                : project
            ),
          })),
        };
      };

      queryClient.setQueryData(["projects"], updateProjects);

      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      console.error("Error during mutation:", error);
      toast.error(error.message ?? "Voting failed");
    },
    onSettled: () => {
      setPendingVote(null);
    },
  });

  return (
    <>
      <Card id={project.id} key={project.id} className="relative">
        {user?.is_admin && (
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 rounded-full hover:bg-red-700 transition-colors duration-200 text-white cursor-pointer"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 text-white cursor-pointer"
            >
              <Settings size={20} />
            </button>
          </div>
        )}

        <div className="z-[-1] absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(134,0,255,0.07),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="flex items-center gap-4">
          <Image
            src={project.logoUrl}
            alt={`${project.name} logo`}
            height={56}
            width={56}
            className="rounded-full"
          />
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-bold">{project.name}</CardTitle>
            {project.categories?.[0] && (
              <span className="w-fit px-2 py-1 font-medium text-xs bg-purple-500/5 text-purple-400 rounded-full border border-purple-500/20">
                {project.categories[0].name}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{project.description}</CardDescription>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t border-white/[0.1]">
          <div className="flex gap-1 sm:gap-4">
            {project.website && (
              <ProjectCTA href={project.website}>
                <Website />
              </ProjectCTA>
            )}
            {project.discord && (
              <ProjectCTA href={project.discord}>
                <Discord />
              </ProjectCTA>
            )}
            {project.twitter && (
              <ProjectCTA href={project.twitter}>
                <Twitter />
              </ProjectCTA>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-sm">
            <VoteButton
              variant="for"
              onClick={() => mutate("FOR")}
              isPending={pendingVote === "FOR"}
              disabled={pendingVote === "AGAINST"}
            >
              {project.votes_for}
            </VoteButton>
            <VoteButton
              variant="against"
              onClick={() => mutate("AGAINST")}
              isPending={pendingVote === "AGAINST"}
              disabled={pendingVote === "FOR"}
            >
              {project.votes_against}
            </VoteButton>
          </div>
        </CardFooter>
      </Card>

      <EditProjectModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        project={project}
      />

      <DeleteProjectModal
        isDialogOpen={isDeleteModalOpen}
        setIsDialogOpen={setIsDeleteModalOpen}
        project={project}
      />
    </>
  );
};
