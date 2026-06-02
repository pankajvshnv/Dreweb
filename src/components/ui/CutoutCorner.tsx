import React from 'react';

interface CutoutCornerProps {
  backgroundColor: string;
  className?: string;
}

export function CutoutCorner({ backgroundColor, className = '' }: CutoutCornerProps) {
  return (
    <div className={`absolute bottom-[-1px] right-[-1px] w-[104px] h-[104px] z-20 pointer-events-none ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 104 104"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M104 0C104 13.2548 93.2548 24 80 24H48C34.7452 24 24 34.7452 24 48V80C24 93.2548 13.2548 104 0 104H104V0Z"
          fill={backgroundColor}
        />
      </svg>
    </div>
  );
}
