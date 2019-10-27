import React, { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import injectSheet from 'react-jss';
import Color from 'color';

const styles = (theme: any) => ({
  button: {
    display: 'block',
    // backgroundImage: 'linear-gradient(rgb(250, 125, 54), rgb(247, 107, 28))',
    backgroundColor: theme.accentColor,
    color: Color(theme.accentColor).luminosity() > 0.6 ? '#333333' : '#EEEEEE',
    lineHeight: 1.5,
    borderRadius: 4,
    textDecoration: 'none',
    padding: '6px 12px',
    textAlign: 'center',
    fontSize: 16,
  },
  disabled: {
    // backgroundImage: 'linear-gradient(rgb(189, 143, 117), rgb(176, 127, 99))',
    backgroundColor: Color(theme.accentColor).desaturate(0.5).hsl().string(),
    cursor: 'default',
  },
})

export interface ButtonProps {
  to?: string;
  onClick?: () => any;
  disabled?: boolean;
  className?: string;
  classes: any;
}

const Button: React.FC<ButtonProps> = ({ to, onClick, disabled, children, classes, className }) => {
  const clickHandler = disabled ? (e: MouseEvent) => e.preventDefault() : onClick;

  const _className = (disabled ? [classes.button, classes.disabled, className] : [classes.button, className]).join(' ');

  if (to) {
    return (
      <Link className={_className} to={to} onClick={clickHandler}>
        {children}
      </Link>
    );
  } else {
    return (
      <button className={_className} onClick={clickHandler} disabled={disabled}>
        {children}
      </button>
    );
  }
}

export default injectSheet(styles)(Button);
