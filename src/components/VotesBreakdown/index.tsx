"use client";

import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { TVoteType } from "@/app/api/votes/[projectId]/route";
import { TVoteBreakdown } from "@/app/api/projects/route";
import { useMediaQuery } from "react-responsive";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { PopoverArrow } from "@radix-ui/react-popover";

interface IVotesBreakdownProps {
  votesBreakdown: TVoteBreakdown[];
  type: TVoteType | "BOTH";
  isOpen: boolean;
}

export const VotesBreakdown: React.FC<IVotesBreakdownProps> = ({
  votesBreakdown,
  type,
  isOpen,
}) => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  if (!votesBreakdown || votesBreakdown.length === 0) return null;

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <div className="cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={40}
        alignOffset={isSmallScreen ? -40 : 0}
        align={type === "BOTH" && isSmallScreen ? "start" : "center"}
        className="relative mr-7 sm:mr-0 w-64 p-4 bg-gray-800/95 backdrop-blur-xl border border-white/5"
      >
        <h3
          className={cn(
            "flex items-center gap-1 text-lg font-semibold",
            type === "FOR" ? "text-emerald-400/60" : "text-red-400/60",
            type === "BOTH" && "text-white"
          )}
        >
          {type === "BOTH" ? (
            "Votes Breakdown"
          ) : (
            <>
              {type === "FOR" ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {type === "FOR" ? "Upvotes Breakdown" : "Downvotes Breakdown"}
            </>
          )}
        </h3>
        <Separator className="my-2" />
        <div className="flex flex-col gap-2">
          {votesBreakdown
            .filter((vote) => vote.votes_for > 0 || vote.votes_against > 0)
            .map((vote) => {
              const colorMapping = {
                MON: "#695CBE",
                OG: "#F88BDF",
                NAD: "#AE377C",
                FULL_ACCESS: "#E3D9D5",
              };

              return (
                <div
                  key={vote.role}
                  className="flex justify-between items-center"
                >
                  <span
                    className={cn("text-sm font-medium")}
                    style={{ color: colorMapping[vote.role] }}
                  >
                    {vote.role}
                  </span>
                  <span
                    className={cn(
                      "font-bold",
                      type === "FOR" ? "text-emerald-400/60" : "text-red-400/60"
                    )}
                  >
                    {type !== "BOTH" &&
                      (type === "FOR"
                        ? `+ ${vote.votes_for}`
                        : `- ${vote.votes_against}`)}
                  </span>
                  {type === "BOTH" && (
                    <span className="font-bold text-xs text-muted-foreground">
                      <span className="text-emerald-400/60">
                        + {vote.votes_for}
                      </span>{" "}
                      /{" "}
                      <span className="text-red-400/60">
                        - {vote.votes_against}
                      </span>
                    </span>
                  )}
                </div>
              );
            })}
        </div>
        <PopoverArrow className="fill-gray-800/95 w-5 h-2" />
      </PopoverContent>
    </Popover>
  );
};
