import { Badge } from '@/components/ui/badge';

interface ISectionHeader {
  title?: string;
  description?: string;
  subtitle?: string;
}

/**
 * The `SectionHeader` component displays a standardized header section with title, subtitle, and description.
 *
 * ### Features:
 * - **Flexible Content**: Supports optional title, subtitle, and description fields.
 * - **Responsive Design**: Adapts layout and typography for different screen sizes.
 * - **Visual Hierarchy**: Uses different styling for title (badge), subtitle (gradient text), and description.
 * - **Modern Styling**: Implements gradient text effects and consistent spacing.
 *
 * ### Props:
 * - `title`: Optional badge-style title displayed at the top.
 * - `subtitle`: Main heading with gradient text effect (purple to indigo).
 * - `description`: Descriptive text displayed below the subtitle.
 *
 * ### Styling:
 * - **Title**: Badge component with bold font weight.
 * - **Subtitle**: Large gradient text (3xl on mobile, 5xl on desktop) with purple-to-indigo gradient.
 * - **Description**: Medium gray text with responsive sizing and centered layout.
 *
 * ### Responsive Behavior:
 * - Mobile: Smaller text sizes and tighter spacing.
 * - Desktop: Larger text sizes and more generous spacing.
 * - Centered layout maintained across all screen sizes.
 *
 * ### Example:
 * ```tsx
 * <SectionHeader
 *   title="FEATURED"
 *   subtitle="Discover Amazing Projects"
 *   description="Explore the latest projects in the ecosystem"
 * />
 * ```
 *
 * @param props - The props for the `SectionHeader` component.
 * @returns A JSX element representing the section header.
 */
export const SectionHeader: React.FC<ISectionHeader> = ({ title, description, subtitle }) => {
  return (
    <div className="flex flex-col sm:gap-6 justify-center items-center gap-4">
      {title && (
        <Badge variant="default" className="font-bold">
          {title}
        </Badge>
      )}
      <h2 className="text-3xl text-center sm:text-5xl font-bold bg-gradient-to-r from-purple-300 via-purple-500 to-indigo-400 bg-clip-text text-transparent leading-normal">
        {subtitle}
      </h2>
      <p className="text-center text-lg sm:text-xl text-gray-300 leading-[140%] max-w-2xl mx-auto font-medium">
        {description}
      </p>
    </div>
  );
};
