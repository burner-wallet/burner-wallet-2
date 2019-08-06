import React, { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
const classes = require('./Button.module.css');

export interface ButtonProps {
  to?: string,
  onClick?: () => any,
  disabled?: boolean,
}

const Button:React.FC<ButtonProps> = ({ to, onClick, disabled, children }) => {
  const clickHandler = disabled ? (e: MouseEvent) => e.preventDefault() : onClick;

  const className = disabled ? [classes.button, classes.disabled].join(' ') : classes.button;

  if (to) {
    return (
      <Link className={className} to={to} onClick={clickHandler}>
        {children}
      </Link>
    );
  } else {
    return (
      <button className={className} onClick={clickHandler} disabled={disabled}>
        {children}
      </button>
    );
  }
}

export default Button;
