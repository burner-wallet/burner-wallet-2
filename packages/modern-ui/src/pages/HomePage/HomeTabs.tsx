import React, { useState } from 'react';
import styled from 'styled-components';
import { BurnerContext, PluginElementData } from '@burner-wallet/types';
import Balances from './Balances';

const TabButton = styled.button`
  border-radius: 30px;
  display: flex;
  font-size: 16px;
  align-items: center;
  color: 'var(--color-primary);
  padding: 8px 12px;
  border: 1px solid var(--color-primary);
  outline: none;
  margin: 0 4px;
  transition: 0.15s ease-in-out;

  &:disabled {
    background: var(--color-primary);
    color: var(--color-tertiary);
  }

  &:first-child {
    margin-left: 0px;
  }
`;

type HomeTabsProps = Pick<BurnerContext, 'pluginData'>;

const HomeTabs: React.FC<HomeTabsProps> = ({ pluginData }) => {
  const [tab, setTab] = useState(0);

  const pluginTabs = pluginData.elements['home-tab'];

  const tabBtns = pluginTabs ? (
    <div>
      <TabButton onClick={() => setTab(0)} disabled={tab === 0}>
        Cash
      </TabButton>

      {pluginTabs.map(({ options }: PluginElementData, i: number) => (
        <TabButton key={options.title} onClick={() => setTab(i + 1)} disabled={tab === i + 1}>
          {options.title}
        </TabButton>
      ))}
    </div>
  ) : null;

  if (tab === 0) {
    return (
      <div>
        {tabBtns}

        <Balances />
      </div>
    );
  }

  const { Component: TabComponent, plugin: tabPlugin } = pluginTabs[tab - 1];
  return (
    <div>
      {tabBtns}

      <TabComponent plugin={tabPlugin} />
    </div>
  );
};

export default HomeTabs;
