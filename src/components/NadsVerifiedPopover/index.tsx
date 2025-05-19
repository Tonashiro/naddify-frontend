"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";
import { VerifiedIcon } from "@/components/Icons/VerifiedIcon";
import { PopoverArrow } from "@radix-ui/react-popover";

interface INadsVerifiedPopoverProps {
  date: Date;
}

export const NadsVerifiedPopover: React.FC<INadsVerifiedPopoverProps> = ({
  date,
}) => {
  const [isOpen, setIsOpen] = useState(false);

const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className="cursor-pointer"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen((prev) => !prev);
            }
          }}
        >
          <VerifiedIcon />
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={8}
        className="w-64 p-4 bg-gray-800/95 backdrop-blur-xl border border-white/5 rounded-lg"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex items-center gap-2">
          <VerifiedIcon size={20} />
          <span className="text-sm font-medium text-white">
            This project is nads verified.
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <CalendarDays className="text-white" size={20} />
          <span className="text-sm text-muted-foreground">
            Verified since {formattedDate}.
          </span>
        </div>
        <PopoverArrow className="fill-gray-800/95 w-5 h-2" />
      </PopoverContent>
    </Popover>
  );
};
