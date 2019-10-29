import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PluginButtonProps } from '@burner-wallet/types';
import Card from '../../components/Card';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000000;
`;

const AppCard = styled(Card)`
  display: flex;
  flex: 1;
  border-radius: 8px;
  padding: 16px;
  padding-right: 12px;
  margin: 8px 0px;
  font-weight: 400;
  align-items: center;

  &:hover {
    background: #fcfcfc;
  }

  & > span {
    display: block;
  }
`;

const Logo = styled.div<{ url: string }>`
  height: 64px;
  width: 64px;
  background-color: #999999;
  background-image: ${props => `url(${props.url})`};
  background-position: center;
  background-size: contain;
  border-radius: 100px;
`;

const Title = styled.h4`
  margin: 0;
`;

interface AppButtonProps extends PluginButtonProps {
  description?: string;
  logo?: string;
}

const AppButton: React.FC<AppButtonProps> = ({ title, description, logo, to, children }) => (
  <StyledLink to={to}>
    <AppCard>
      <div>
        <Title>{title}</Title>
        {description && (
          <div>{description}</div>
        )}
      </div>

      {children}

      {logo && (
        <Logo url={logo} />
      )}
    </AppCard>
  </StyledLink>
);

export default AppButton;
