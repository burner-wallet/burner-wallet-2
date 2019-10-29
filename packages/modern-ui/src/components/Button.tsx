import React from 'react';
import { ButtonProps } from '@burner-wallet/types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const buttonStyles = `
  display: block;
  line-height: 1.5;
  border-radius: 4px;
  text-decoration: none;
  padding: 8px 16px;
  text-align: center;
  font-size: 16px;
  height: 48px;
  align-items: center;
  display: flex;
  justify-content: center;
  border: none;
  color: white;
`;

interface ButtonStyleProps {
  color?: string;
  background?: string;
}

const StandardButton = styled.button<ButtonStyleProps>`
  ${buttonStyles}
  background-color: ${props => props.theme.accentColor};
  color: ${props => props.color};
  background: ${props => props.background};
`;

const LinkButton = styled(Link)<ButtonStyleProps>`
  ${buttonStyles}
  background-color: ${props => props.theme.accentColor};
  color: ${props => props.color};
  background: ${props => props.background};
`;

const Button: React.FC<ButtonProps> = ({ to, ...props }) => {
  return to ? (
    <LinkButton to={to} {...props} />
  ) : (
    <StandardButton {...props} />
  );
}

export default Button;
