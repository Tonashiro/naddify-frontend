import React from 'react';

interface IRoleCircleProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export const RoleCircle: React.FC<IRoleCircleProps> = ({
  size = 8,
  color = '#FD2489',
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      aria-label="Role Circle"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill={color} />
    </svg>
  );
};
