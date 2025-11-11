import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  variant = 'default',
  hover = false,
  glow = false,
  className = '',
  onClick,
  ...props 
}) => {
  const classes = [
    'card',
    `card-${variant}`,
    hover && 'card-hover',
    glow && 'card-glow',
    onClick && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;