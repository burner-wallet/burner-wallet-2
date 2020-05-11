import React from 'react';
import _styled, { ThemedStyledInterface } from 'styled-components';
import { Route } from 'react-router-dom';
import { withBurner, BurnerContext } from '@burner-wallet/ui-core';
import { SCAN_QR_DATAURI } from '../lib';
import { BurnerTheme } from '../Template';

const styled = (_styled as ThemedStyledInterface<BurnerTheme>);

const HeaderElement = styled.header`
  display: flex;
  height: 64px;
  align-items: center;
  justify-content: space-between;
  margin: 0 ${props => props.theme.pageMargin};
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${props => props.theme.logo && `
    background-image: url(${props.theme.logo});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 4px center;
    padding-left: 44px;
  `}
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const Subtitle = styled.div`
  font-size: 12px;
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderAccount = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
`;

const MiniQRButton = styled.button`
  background: url("${SCAN_QR_DATAURI}");
  background-size: contain;
  background-size: 75%;
  background-position: center;
  background-repeat: no-repeat;
  margin-left: 8px;
  height: 40px;
  width: 40px;
  outline: none;
`;

interface HeaderProps extends BurnerContext {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ defaultAccount, title, actions }) => (
  <HeaderElement>
    <TitleContainer>
      <Title>{title || 'Burner Wallet'}</Title>
      {title && title !== 'Burner Wallet' && (
        <Subtitle>Powered by Burner Wallet</Subtitle>
      )}
    </TitleContainer>

    <RightSide>
      <HeaderAccount onClick={() => actions.navigateTo('/receive')}>
        {defaultAccount.substr(2, 8)}
      </HeaderAccount>

      <Route exact path="/">
        {({ match }) => match ? null : (
          <MiniQRButton onClick={actions.openDefaultQRScanner} />
        )}
      </Route>
    </RightSide>
  </HeaderElement>
);


export default withBurner(Header);
