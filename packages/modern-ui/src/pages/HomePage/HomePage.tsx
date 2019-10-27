import React from 'react';
import { Link } from 'react-router-dom';
import { BurnerContext, withBurner, DataProviders } from '@burner-wallet/ui-core';
import styled from 'styled-components';

import Button from '../../components/Button';
import Page from '../../components/Page';
// import PluginButtons from '../../components/PluginButtons';
import HistoryList from '../../components/HistoryList';
import AppButton from './AppButton';
import BottomActions from './BottomActions';
import HomeTabs from './HomeTabs';

const BottomActionsContainer = styled.div`
  position: fixed;
  bottom: 32px;
  left: 0;
  right: 0;
`;

const ViewAllButton = styled(Link)`
  background: #f2f2f2;
  border-radius: 30px;
  display: flex;
  align-items: center;
  color: #555;
  padding: 8px 12px;
  text-decoration: none;

  &:after {
    content: '\\203A';
    margin-left: 10px;
  }
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0 4px;
`;

const SubHeading = styled.h2<{ line?: boolean }>`
  font-size: var(--l2-fs);
  line-height: var(--l2-lh);
  font-weight: var(--l2-weight);
  margin: 8px 0 4px;
  color: #222222;

  ${props => props.line && `border-bottom: solid 1px #f2f2f2;`}
`;

const { PluginElements } = DataProviders;

const HomePage: React.FC<BurnerContext> = ({ defaultAccount, actions, pluginData }) => {
  return (
    <Page>
      <PluginElements position='home-top' />

      <HomeTabs pluginData={pluginData} />

      <PluginElements position='home-middle' />

      <ActivityHeader>
        <SubHeading>Recent activity</SubHeading>
        <ViewAllButton to='/activity'>View All</ViewAllButton>
      </ActivityHeader>

      <HistoryList account={defaultAccount} limit={3} navigateTo={actions.navigateTo} />

      <SubHeading line>Apps</SubHeading>

      {/*<PluginButtons position='apps' component={AppButton} />

      <PluginButtons
        position='home'
        component={({ path, title }) => (
          <Link to={path} style={{ display: 'block' }}>
            {title}
          </Link>
        )}
      />*/}
      <Link to='/advanced'>Advanced</Link>

      <BottomActionsContainer>
        <BottomActions actions={actions} />
      </BottomActionsContainer>
    </Page>
  );
};

export default withBurner(HomePage);
