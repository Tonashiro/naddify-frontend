import { useSpring, animated } from "react-spring";

interface IAnimatedNumber {
  total: number;
}

export const AnimatedNumber: React.FC<IAnimatedNumber> = ({ total }) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: total },
    config: { duration: 1000, tension: 20, friction: 10 },
  });

  return (
    <animated.span className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
      {number.to((n) => n.toFixed(0))}
    </animated.span>
  );
};
