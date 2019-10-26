import React from 'react';
import Page from '../../components/Page';
import { DataProviders } from '@burner-wallet/ui-core';

const { PluginElements } = DataProviders;

const AdvancedPage: React.FC = () => {
  return (
    <Page title="Advanced">
      <PluginElements position='advanced' />
    </Page>
  );
};

export default AdvancedPage;
