import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

interface IProjectSearchProps {
  className?: string
  onSearch: (query: string) => void
}

/**
 * The `ProjectSearch` component provides a search input field with debounced functionality
 * for searching projects.
 *
 * ### Features:
 * - **Debounced Search**:
 *   - Implements 300ms debounce to prevent excessive API calls
 *   - Only triggers search after user stops typing
 * - **Visual Feedback**:
 *   - Search icon on the left side
 *   - Purple border and focus states
 *   - Custom placeholder styling
 * - **Responsive Design**:
 *   - Accepts className prop for flexible styling
 *   - Full width by default with customizable layout
 *
 * ### Props:
 * - `className` (`string?`): Optional CSS classes for container customization
 * - `onSearch` (`(query: string) => void`): Callback function triggered on search value change
 *
 * ### Example:
 * ```tsx
 * <ProjectSearch
 *   className="w-full md:w-1/3"
 *   onSearch={(query) => {
 *     // Handle search query
 *     console.log('Searching for:', query);
 *   }}
 * />
 * ```
 *
 * ### Implementation Details:
 * - Uses internal state to manage input value
 * - Implements useDebounce hook with 300ms delay
 * - Triggers onSearch callback when debounced value changes
 * - Styled with Tailwind CSS for consistent theming
 *
 * @component
 * @param props - Component props
 * @returns A search input field with debounced search functionality
 */
export const ProjectSearch: React.FC<IProjectSearchProps> = ({
  className,
  onSearch,
}) => {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 300)

  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-100/50" />
      <Input
        placeholder="Search projects"
        className="w-full pl-9 border border-purple-300 placeholder:text-purple-100/50 focus-visible:ring-purple-400 focus:border-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}
