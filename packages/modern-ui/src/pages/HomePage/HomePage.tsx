import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HistoryEvent from '@burner-wallet/core/HistoryEvent';
import { BurnerContext, withBurner, DataProviders } from '@burner-wallet/ui-core';
import { PluginElementData, Plugin } from '@burner-wallet/types';
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
  justifyContent: space-between;
  alignItems: center;
`;

const { PluginElements, History } = DataProviders;

const HomePage: React.FC<BurnerContext> = ({ defaultAccount, actions, pluginData }) => {
  return (
    <Page>
      <PluginElements position='home-top' />

      <HomeTabs pluginData={pluginData} />

      <PluginElements position='home-middle' />

      <div style={{ margin: '0 var(--page-margin) var(--page-margin)' }}>
        <ActivityHeader>
          <h2>Recent activity</h2>
          <ViewAllButton to='/activity'>View All</ViewAllButton>
        </ActivityHeader>

        <HistoryList account={defaultAccount} limit={3} navigateTo={actions.navigateTo} />
      </div>

      <h2 style={{ borderBottom: '1px solid #f2f2f2' }}>Apps</h2>

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
