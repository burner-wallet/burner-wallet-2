import React from 'react';
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

const StandardButton = styled.button`
  ${buttonStyles}
  background-color: ${props => props.theme.accentColor};
  color: ${props => props.color};
  background: ${props => props.background};
`;

const LinkButton = styled(Link)`
  ${buttonStyles}
  background-color: ${props => props.theme.accentColor};
  color: ${props => props.color};
  background: ${props => props.background};
`;

interface ButtonProps {
  to?: string;
}

const Button: React.FC<ButtonProps> = ({ to, ...props }) => {
  return to ? (
    <LinkButton to={to} {...props} />
  ) : (
    <StandardButton {...props} />
  );
}

export default Button;
