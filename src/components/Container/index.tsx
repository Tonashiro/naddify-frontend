import type { ReactNode } from 'react';

/**
 * A reusable `Container` component that serves as a layout wrapper.
 *
 * @remarks
 * This component is designed to center its content, apply responsive
 * horizontal padding, and restrict the maximum width to 1920px.
 *
 * @param children - The content to be rendered inside the container.
 *
 * @returns A `div` element with the specified layout styles applied.
 *
 * @example
 * ```tsx
 * <Container>
 *   <p>Your content goes here</p>
 * </Container>
 * ```
 */
const Container = ({ children }: { children: ReactNode }) => {
  return <div className="container mx-auto px-4 sm:px-6 lg:px-16">{children}</div>;
};

export default Container;
