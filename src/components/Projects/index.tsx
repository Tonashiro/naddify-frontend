import { IProject } from "@/app/api/projects/route";
import { ProjectCard } from "@/components/ProjectCard";

interface IProjects {
  projects: IProject[];
  revalidateData: () => Promise<void>;
}

/**
 * The `Projects` component renders a grid of project cards.
 *
 * ### Features:
 * - **Grid Layout**:
 *   - Displays projects in a responsive grid layout.
 *   - Adjusts the number of columns based on the screen size:
 *     - 1 column on small screens.
 *     - 2 columns on medium screens.
 *     - 3 columns on extra-large screens.
 * - **Project Cards**:
 *   - Renders a `ProjectCard` for each project in the `projects` array.
 *   - Passes the project data and a default logo URL to each card.
 *
 * ### Props:
 * - `projects` (`IProject[]`): An array of project objects to display.
 *
 * ### Styling:
 * - Uses Tailwind CSS for styling.
 * - Includes responsive grid classes (`grid-cols-1`, `md:grid-cols-2`, `2xl:grid-cols-3`) for layout.
 * - Adds spacing between grid items using `gap-6`.
 * - Includes a bottom margin (`mb-[5%]`) for spacing below the grid.
 *
 * ### Example:
 * ```tsx
 * import { Projects } from "@/components/Projects";
 *
 * const projectData = [
 *   { id: "1", name: "Project A", description: "Description A", ... },
 *   { id: "2", name: "Project B", description: "Description B", ... },
 * ];
 *
 * <Projects projects={projectData} />;
 * ```
 *
 * @param props - The props for the `Projects` component.
 * @param props.projects - An array of project objects to display.
 * @returns A JSX element representing the grid of project cards.
 */
export const Projects = ({ projects, revalidateData }: IProjects) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 mb-[5%]">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          revalidateData={revalidateData}
        />
      ))}
    </section>
  );
};
