import React from 'react';
import { ButtonProps } from '@burner-wallet/types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// automaticaly darken active color
const buttonStyles = `
  display: block;
  line-height: 1.5;
  border-radius: 4px;
  text-decoration: none;
  padding: 8px 16px;
  text-align: center;
  font-size: 16px;
  min-height: 48px;
  align-items: center;
  display: flex;
  justify-content: center;
  border: none;
  color: white;
  outline: none;

  &:active {
    background: #3e30bb;
  }
`;

interface ButtonStyleProps {
  color?: string;
  background?: string;
  disabled?: boolean;
}

const StandardButton = styled.button<ButtonStyleProps>`
  ${buttonStyles}
  color: ${props => props.color || props.theme.accentText};
  background: ${props => props.background || props.theme.accentColor};

  &:active {
    background: ${props => props.theme.accentDark};
  }

  &:disabled {
    background: ${props => props.theme.accentLight};
  }
`;

const LinkButton = styled(Link)<ButtonStyleProps>`
  ${buttonStyles}
  color: ${props => props.color || props.theme.accentText};
  background: ${props => props.background || props.theme.accentColor};

  &:active {
    background: ${props => props.theme.accentDark};
  }

  &:disabled {
    background: ${props => props.theme.accentLight};
  }
`;

const Button: React.FC<ButtonProps> = ({ to, ...props }) => {
  return to ? (
    <LinkButton to={to} {...props} />
  ) : (
    <StandardButton {...props} />
  );
}

export default Button;
