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
  return <div className="mx-auto w-full max-w-[1920px] px-[5%]">{children}</div>;
};

export default Container;
