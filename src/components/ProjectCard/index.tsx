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
import { InfoIcon } from "lucide-react";
import { DeleteProjectModal } from "@/components/DeleteProjectModal";
import { useRouter } from "next/navigation";
import { VotesBreakdown } from "@/components/VotesBreakdown";

export interface IProjectCard {
  project: IProject;
  isPreview?: boolean;
}

/**
 * The `ProjectCard` component displays detailed information about a project in a card format.
 *
 * ### Features:
 * - **Project Details**:
 *   - Displays the project name, description, logo, and category.
 *   - Includes links to the project's website, Twitter, Discord.
 * - **Voting System**:
 *   - Allows users to vote "FOR" or "AGAINST" a project.
 *   - Updates the vote count dynamically using React Query.
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
 *
 * ### Example:
 * ```tsx
 * <ProjectCard project={projectData} />
 * ```
 *
 * @param props - The props for the `ProjectCard` component.
 * @returns A JSX element representing the project card.
 */
export const ProjectCard: React.FC<IProjectCard> = ({ project, isPreview }) => {
  const [pendingVote, setPendingVote] = useState<"FOR" | "AGAINST" | null>(
    null
  );
  const [hoveredVoteType, setHoveredVoteType] = useState<
    "FOR" | "AGAINST" | "BOTH" | null
  >(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user, connectDiscord } = useUserContext();
  const router = useRouter();

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
        throw new Error(error.message ?? "Voting failed");
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Vote submitted successfully!");
      const { project_id } = data.vote;
      const { votesFor, votesAgainst } = data.stats;
      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["projects"] });

      // Update each query's cache
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
          }
        );
      });

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
      <Card
        id={project.id}
        key={project.id}
        className="relative min-h-[280px] cursor-pointer"
        onClick={() => !isPreview && router.push(`/projects/${project.id}`)}
      >
        {project.nads_verified && (
          <div className="absolute top-[-20px] left-[-20px] pointer-events-none">
            <Image
              src="/images/nads_verified.svg"
              width={80}
              height={80}
              alt="Nads verified badge"
            />
          </div>
        )}
        <div className="absolute top-0 left-0 inset-0 w-full h-[120px] rounded-t-xl brightness-75 z-[-1] bg-purple-600/50">
          {project.banner_url && (
            <Image
              src={project.banner_url}
              height={120}
              width={280}
              alt={`${project.name} banner`}
              className="w-full h-[120px] max-h-[120px] z-[-1] rounded-t-xl bg-purple-500"
            />
          )}
        </div>

        {/* {!isPreview && (
          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/projects/${project.id}/edit`);
              }}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 text-white cursor-pointer"
            >
              <Pencil size={20} />
            </button>
          </div>
        )} */}

        <div className="z-[-1] absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(134,0,255,0.07),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pt-[64px] flex flex-col">
          <Image
            src={project.logo_url ?? "/images/monad.webp"}
            alt={`${project.name} logo`}
            height={56}
            width={56}
            className="rounded-full max-w-[56px] max-h-[56px]"
          />
          <div className="flex gap-4 items-center w-full">
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
            <div
              className="relative"
              onMouseEnter={() => setHoveredVoteType("FOR")}
              onMouseLeave={() => setHoveredVoteType(null)}
            >
              <VoteButton
                variant="for"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isPreview) mutate("FOR");
                }}
                isPending={pendingVote === "FOR"}
                disabled={pendingVote === "AGAINST"}
              >
                {project.votes_for}
              </VoteButton>
              {project.votes_breakdown &&
                project.votes_breakdown.some((vote) => vote.votes_for > 0) && (
                  <VotesBreakdown
                    votesBreakdown={project.votes_breakdown}
                    type="FOR"
                    isOpen={hoveredVoteType === "FOR"}
                  />
                )}
            </div>
            <div
              className="relative"
              onMouseEnter={() => setHoveredVoteType("AGAINST")}
              onMouseLeave={() => setHoveredVoteType(null)}
            >
              <VoteButton
                variant="against"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isPreview) mutate("AGAINST");
                }}
                isPending={pendingVote === "AGAINST"}
                disabled={pendingVote === "FOR"}
              >
                {project.votes_against}
              </VoteButton>
              {project.votes_breakdown &&
                project.votes_breakdown.some(
                  (vote) => vote.votes_against > 0
                ) && (
                  <VotesBreakdown
                    votesBreakdown={project.votes_breakdown}
                    type="AGAINST"
                    isOpen={hoveredVoteType === "AGAINST"}
                  />
                )}
            </div>

            <div className="relative">
              {project.votes_breakdown &&
                project.votes_breakdown.some(
                  (vote) => vote.votes_against > 0 || vote.votes_for > 0
                ) && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hoveredVoteType !== "BOTH")
                          setHoveredVoteType("BOTH");
                        else setHoveredVoteType(null);
                      }}
                      className="lg:hidden p-2 sm:px-3.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer bg-white/[0.05] shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
                    >
                      <InfoIcon />
                    </button>

                    <VotesBreakdown
                      votesBreakdown={project.votes_breakdown}
                      type="BOTH"
                      isOpen={hoveredVoteType === "BOTH"}
                    />
                  </>
                )}
            </div>
          </div>
        </CardFooter>
      </Card>

      <DeleteProjectModal
        isDialogOpen={isDeleteModalOpen}
        setIsDialogOpen={setIsDeleteModalOpen}
        project={project}
      />
    </>
  );
};
