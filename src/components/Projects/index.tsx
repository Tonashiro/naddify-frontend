"use client";

import { IProject } from "@/app/api/projects/route";
import { ProjectCard } from "@/components/ProjectCard";

interface Props {
  projects: IProject[];
}

export const Projects = ({ projects }: Props) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          title={project.name}
          description={project.description}
          category={project.categories[0]?.name ?? "Uncategorized"}
          twitterHandle={project.twitter ?? ""}
          upvotes={project.votes_for}
          downvotes={project.votes_against}
          websiteUrl={project.website ?? ""}
          discordUrl={project.discord ?? ""}
          logoUrl="/images/monad.webp"
        />
      ))}
    </section>
  );
};
