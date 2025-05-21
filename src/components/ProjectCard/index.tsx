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
import { InfoIcon, Pencil, Trash2 } from "lucide-react";
import { DeleteProjectModal } from "@/components/DeleteProjectModal";
import { useRouter } from "next/navigation";
import { VotesBreakdown } from "@/components/VotesBreakdown";
import { NadsVerifiedPopover } from "@/components/NadsVerifiedPopover";
import { TVoteType } from "@/app/api/votes/[projectId]/route";

export interface IProjectCard {
  project: IProject;
  isPreview?: boolean;
  revalidateData: () => Promise<void>;
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
export const ProjectCard: React.FC<IProjectCard> = ({
  project,
  isPreview,
  revalidateData,
}) => {
  const [pendingVote, setPendingVote] = useState<"FOR" | "AGAINST" | null>(
    null
  );
  const [hoveredVoteType, setHoveredVoteType] = useState<
    "FOR" | "AGAINST" | "BOTH" | null
  >(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { user, connectDiscord } = useUserContext();
  const router = useRouter();
  const queryClient = useQueryClient();

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

      await revalidateData();

      return res.json();
    },
    onSuccess: (data) => {
      const { message, stats, votesBreakdown } = data;

      const { votesFor, votesAgainst } = stats;
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
                projects: page.projects.map((p) =>
                  p.id === project.id
                    ? {
                        ...p,
                        votes_for: votesFor,
                        votes_against: votesAgainst,
                        votes_breakdown: votesBreakdown,
                      }
                    : p
                ),
              })),
            };
          }
        );
      });

      if (message === "Vote removed successfully") {
        toast.info("Your vote has been removed.");
      } else if (message === "Vote updated successfully") {
        toast.success("Your vote has been updated.");
      } else if (message === "Vote recorded successfully") {
        toast.success("Your vote has been recorded.");
      }
    },
    onError: (error) => {
      console.error("Error during mutation:", error);
      toast.error(error.message ?? "Voting failed");
    },
    onSettled: () => {
      setPendingVote(null);
    },
  });

  const handleVote = (voteType: TVoteType) => {
    if (!user) {
      connectDiscord();
      return;
    }

    mutate(voteType);
  };

  return (
    <>
      <Card id={project.id} key={project.id} className="relative min-h-[280px]">
        <div className="absolute top-0 left-0 inset-0 w-full h-[150px] rounded-t-xl bg-purple-600/50">
          {project.banner_url && (
            <Image
              src={project.banner_url}
              height={150}
              width={485}
              quality={100}
              alt={`${project.name} banner`}
              className="w-full h-[150px] max-h-[150px] z-[-1] rounded-t-xl bg-purple-500"
            />
          )}
        </div>

        {!isPreview && user?.is_admin && (
          <div className="flex gap-2 absolute top-4 right-4 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/projects/${project.id}/edit`);
              }}
              className="p-2 rounded-full bg-gray-700 hover:opacity-80 transition-colors duration-200 text-white cursor-pointer"
            >
              <Pencil size={20} />
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 rounded-full bg-red-700 hover:opacity-80 transition-colors duration-200 text-white cursor-pointer"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}

        <CardHeader className="pt-[93px] flex flex-col z-10">
          <Image
            src={project.logo_url ?? "/images/monad.webp"}
            alt={`${project.name} logo`}
            height={56}
            width={56}
            className="rounded-full max-w-[56px] max-h-[56px] outline-2 outline-black shadow-md"
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold">
                {project.name}
              </CardTitle>
              {/* TODO: Integrate with nads_verified_at */}
              {project.nads_verified && project.nads_verified_at && (
                <NadsVerifiedPopover date={project.nads_verified_at} />
              )}
            </div>
            {project.categories && (
              <div className="flex items-center gap-1">
                {project.categories.map((category) => (
                  <span
                    key={category.id}
                    className="w-fit px-2 py-1 font-medium text-xs bg-purple-500/5 text-purple-400 rounded-full border border-purple-500/20 pointer-events-none"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{project.description}</CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col lg:flex-row lg:justify-between items-start border-t border-white/[0.1]">
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
          <div className="flex items-center gap-1 sm:gap-2 text-sm self-end">
            <div
              className="relative"
              onMouseEnter={() => setHoveredVoteType("FOR")}
              onMouseLeave={() => setHoveredVoteType(null)}
            >
              <VoteButton
                variant="for"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isPreview) handleVote("FOR");
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
                  if (!isPreview) handleVote("AGAINST");
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
