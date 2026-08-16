import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  style = {},
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`card ${className}`}
      style={{
        padding: '20px',
        cursor: onClick ? 'pointer' : 'default',
        ...(hoverEffect && onClick
          ? {
              transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
            }
          : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
