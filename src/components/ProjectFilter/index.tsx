"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { TProjectStatus } from "@/app/api/projects/route";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ICategoryOption {
  id: string;
  name: string;
}

interface ProjectFilterProps {
  selectedStatuses: TProjectStatus[];
  setSelectedStatuses: Dispatch<SetStateAction<TProjectStatus[]>>;
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  categories: ICategoryOption[];
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  selectedStatuses,
  setSelectedStatuses,
  selectedCategories,
  setSelectedCategories,
  categories,
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleStatusSelect = (status: TProjectStatus) => {
    setSelectedStatuses(
      (prev) => (prev.includes(status) ? [] : [status]) // Toggle selection
    );
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(
      (prev) => (prev.includes(categoryId) ? [] : [categoryId]) // Toggle selection
    );
  };

  const FilterContent = () => (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Status</h2>
      <div className="space-y-2 mb-4">
        {(["PENDING", "TRUSTABLE", "RUG"] as TProjectStatus[]).map(
          (status) => (
            <button
              key={status}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md transition-colors cursor-pointer",
                selectedStatuses.includes(status)
                  ? "bg-purple-700 text-white"
                  : "hover:bg-gray-800"
              )}
              onClick={() => handleStatusSelect(status)}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          )
        )}
      </div>

      <Separator className="my-4" />

      <h2 className="text-lg font-semibold mb-2">Categories</h2>
      <div className="space-y-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md transition-colors cursor-pointer",
              selectedCategories.includes(cat.id)
                ? "bg-purple-700 text-white"
                : "hover:bg-gray-800"
            )}
            onClick={() => handleCategorySelect(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar for larger screens */}
      <aside className="hidden lg:block w-[260px] border-r border-gray-800 p-4 sticky top-[80px] h-fit mb-[5%]">
        <FilterContent />
      </aside>

      {/* Mobile filter button */}
      <button
        className="lg:hidden w-fit self-end flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-full shadow-md transition-colors"
        onClick={() => setIsMobileFilterOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 14.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-2.586L3.293 6.707A1 1 0 013 6V4z"
          />
        </svg>
        Filter
      </button>

      {/* Mobile filter drawer with transition */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 flex transition-opacity duration-300",
          isMobileFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "bg-gray-900 h-full p-4 transition-transform duration-300",
            isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
          )}
          style={{ width: "260px" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          <FilterContent />
        </div>
        <div
          className="flex-1"
          onClick={() => setIsMobileFilterOpen(false)}
        ></div>
      </div>
    </>
  );
};
