import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { TVoteType } from "@/app/api/votes/[projectId]/route";

// Define button variants for "for" and "against"
const voteButtonVariants = cva(
  "flex items-center gap-2 p-2 sm:px-3.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer bg-white/[0.05] shadow-[0_2px_4px_rgba(0,0,0,0.02)] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        for: "text-emerald-400 hover:text-emerald-500 hover:bg-emerald-500/10 ",
        against: "text-red-400 hover:text-red-500 hover:bg-red-500/10",
      },
    },
    defaultVariants: {
      variant: "for",
    },
  }
);

/**
 * SVG icon for the "for" variant.
 */
const ForIcon: React.FC = () => (
  <svg
    className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 text-emerald-300"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"></path>
  </svg>
);

/**
 * SVG icon for the "against" variant.
 */
const AgainstIcon: React.FC = () => (
  <svg
    className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 text-red-400"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 9l-7 7-7-7"
    ></path>
  </svg>
);

interface IVoteButton extends React.ComponentProps<"button"> {
  isPending: boolean;
  alreadyVoted?: TVoteType;
}

/**
 * A button component for voting, with "for" and "against" variants.
 *
 * @param props - The props for the VoteButton component.
 */
function VoteButton({
  className,
  variant,
  children,
  isPending,
  alreadyVoted,
  ...props
}: IVoteButton & VariantProps<typeof voteButtonVariants>) {
  return (
    <button
      className={cn(
        voteButtonVariants({ variant, className }),
        alreadyVoted === "FOR" && variant === "for" && "bg-emerald-500/20",
        alreadyVoted === "AGAINST" && variant === "against" && "bg-red-500/20"
      )}
      {...props}
    >
      {isPending ? (
        <svg
          className={cn(
            "animate-spin h-4 w-4",
            variant === "for" ? "text-emerald-400/60" : "text-red-400/60"
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      ) : (
        <>
          {variant === "for" && <ForIcon />}
          {variant === "against" && <AgainstIcon />}
          <span className="min-w-[1rem] text-center">{children}</span>
        </>
      )}
    </button>
  );
}

export { VoteButton, ForIcon, AgainstIcon };
