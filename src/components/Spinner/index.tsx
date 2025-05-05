export const Spinner = ({ size = "h-12 w-12" }: { size?: string }) => (
  <output
    className={`animate-spin rounded-full ${size} border-t-4 border-purple-500 border-solid`}
    aria-label="Loading"
  />
);
