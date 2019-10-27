import React from 'react';
import { BurnerContext, withBurner } from '@burner-wallet/ui-core';
import Page from '../../components/Page';
import HistoryList from '../../components/HistoryList';


const ActivityPage: React.FC<BurnerContext> = ({ defaultAccount, actions }) => {
  return (
    <Page title="Recent Activity">
      <HistoryList account={defaultAccount} navigateTo={actions.navigateTo} />
    </Page>
  );
};

export default withBurner(ActivityPage);
