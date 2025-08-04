import { useEffect, useState } from 'react';

/**
 * A custom hook that creates a debounced version of a value.
 *
 * ### Features:
 * - **Generic Type Support**:
 *   - Works with any value type through TypeScript generics
 *   - Preserves type safety of the original value
 * - **Configurable Delay**:
 *   - Accepts custom delay duration in milliseconds
 *   - Default use case is typically 300ms for search inputs
 * - **Memory Management**:
 *   - Properly cleans up timeouts on unmount
 *   - Prevents memory leaks through useEffect cleanup
 *
 * ### Use Cases:
 * - Search input debouncing
 * - Form validation delays
 * - API call rate limiting
 * - Window resize event handling
 *
 * ### Example:
 * ```tsx
 * const SearchComponent = () => {
 *   const [searchTerm, setSearchTerm] = useState('')
 *   const debouncedSearch = useDebounce(searchTerm, 300)
 *
 *   useEffect(() => {
 *     // API call here will only trigger 300ms after the last change
 *     searchAPI(debouncedSearch)
 *   }, [debouncedSearch])
 *
 *   return <input onChange={(e) => setSearchTerm(e.target.value)} />
 * }
 * ```
 *
 * @template T - The type of the value being debounced
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
