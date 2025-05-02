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
import { IProject } from "@/app/api/projects/route";

export interface IProjectCard {
  id: string;
  title: string;
  description: string;
  category: string;
  twitterHandle: string;
  upvotes: number;
  downvotes: number;
  websiteUrl: string;
  discordUrl: string;
  logoUrl: string;
}

/**
 * A card component to display project details.
 *
 * @param props - The props for the ProjectCard component.
 */
export const ProjectCard: React.FC<IProjectCard> = ({
  id,
  title,
  description,
  category,
  twitterHandle,
  upvotes,
  downvotes,
  websiteUrl,
  discordUrl,
  logoUrl,
}) => {
  const [pendingVote, setPendingVote] = useState<"FOR" | "AGAINST" | null>(
    null
  );
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (voteType: "FOR" | "AGAINST") => {
      setPendingVote(voteType);
      const res = await fetch(`/api/votes/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteType }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Voting failed");
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Vote submitted successfully!");
      const { project_id } = data.vote;
      const { votesFor, votesAgainst } = data.stats;

      queryClient.setQueryData<{ projects: IProject[] }>(
        ["projects"],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            projects: old.projects.map((project) =>
              project.id === project_id
                ? {
                    ...project,
                    votes_for: votesFor,
                    votes_against: votesAgainst,
                  }
                : project
            ),
          };
        }
      );
    },
    onError: (error) => {
      console.error("Error during mutation:", error);
      toast.error(error.message);
    },
    onSettled: () => {
      setPendingVote(null);
    },
  });

  return (
    <Card id={id} key={id}>
      <div className="z-[-1] absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(134,0,255,0.07),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="flex items-center gap-4">
        <Image
          src={logoUrl}
          alt={`${title} logo`}
          height={56}
          width={56}
          className="rounded-full"
        />
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          <span className="w-fit px-2 py-1 font-medium text-xs bg-purple-500/5 text-purple-400 rounded-full border border-purple-500/20">
            {category}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t border-white/[0.1]">
        <div className="flex gap-1 sm:gap-4">
          <ProjectCTA href={websiteUrl}>
            <Website />
          </ProjectCTA>
          <ProjectCTA href={discordUrl}>
            <Discord />
          </ProjectCTA>
          <ProjectCTA href={twitterHandle}>
            <Twitter />
          </ProjectCTA>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 text-sm">
          <VoteButton
            variant="for"
            onClick={() => mutate("FOR")}
            isPending={pendingVote === "FOR"} // Show spinner only if "FOR" is pending
          >
            {upvotes}
          </VoteButton>
          <VoteButton
            variant="against"
            onClick={() => mutate("AGAINST")}
            isPending={pendingVote === "AGAINST"} // Show spinner only if "AGAINST" is pending
          >
            {downvotes}
          </VoteButton>
        </div>
      </CardFooter>
    </Card>
  );
};
