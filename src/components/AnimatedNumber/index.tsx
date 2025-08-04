import { useSpring, animated } from 'react-spring';

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
    <animated.span className="text-[56px] sm:text-[64px] font-bold text-white">
      {number.to((n) => n.toFixed(0))}
    </animated.span>
  );
};
