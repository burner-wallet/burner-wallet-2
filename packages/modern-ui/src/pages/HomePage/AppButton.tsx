import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PluginButtonProps } from '@burner-wallet/types';

const AppCard = styled(Link)`
  text-decoration: none;
  color: #000000;
  display: flex;
  border-radius: 8px;
  padding: 16px;
  padding-right: 12px;
  margin: 8px 0px;
  font-weight: 400;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 8px 16px;
  background: white;

  &:hover {
    background: #fcfcfc;
  }

  & > span {
    display: block;
  }

  &:active {
    background: #EEEEEE;
  }
`;

const TextContainer = styled.div`
  flex: 1;
`;

const Logo = styled.div<{ url: string }>`
  height: 64px;
  width: 64px;
  background-color: #999999;
  background-image: ${props => `url(${props.url})`};
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 100px;
  margin-left: 8px;
`;

const Title = styled.h4`
  margin: 0;
`;

interface AppButtonProps extends PluginButtonProps {
  description?: string;
  logo?: string;
}

const AppButton: React.FC<AppButtonProps> = ({ title, description, logo, to, children }) => (
  <AppCard to={to}>
    <TextContainer>
      <Title>{title}</Title>
      {description && (
        <div>{description}</div>
      )}
    </TextContainer>

    {children}

    {logo && (
      <Logo url={logo} />
    )}
  </AppCard>
);

export default AppButton;
