import React from "react";

interface IProjectCTA {
  href: string;
  children: React.ReactNode;
}

/**
 * ProjectCTA component renders a styled anchor element that opens the provided link in a new tab.
 * It accepts children to render inside the anchor element.
 *
 * @param {IProjectCTA} props - The props for the component.
 * @returns {JSX.Element} The rendered ProjectCTA component.
 */
const ProjectCTA: React.FC<IProjectCTA> = ({ href, children }: IProjectCTA) => {
  return (
    <a
      href={href}
      onClick={(e) => e.stopPropagation()}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center bg-white/[0.05] size-9 rounded-lg hover:scale-105 transition-all duration-300 hover:shadow-[0_4px_8px_rgba(168,85,247,0.2),0_0_0_1px_rgba(168,85,247,0.25)]"
    >
      {children}
    </a>
  );
};

export default ProjectCTA;
