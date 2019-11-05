import React, { useState } from 'react';
import styled from 'styled-components';
import { BurnerContext, PluginElementData } from '@burner-wallet/types';

const Container = styled.div`margin: 12px 0;`;

const TabContainer = styled.div`display: flex;`;

const TabButton = styled.button`
  border-radius: 30px;
  display: flex;
  font-size: 16px;
  align-items: center;
  color: var(--color-primary);
  padding: 8px 12px;
  border: 1px solid var(--color-primary);
  outline: none;
  margin: 0 4px;
  transition: 0.15s ease-in-out;

  &:hover {
    background: #e0faf8;
  }

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

  const { Component: TabComponent, plugin: tabPlugin } = pluginTabs[tab];
  return (
    <Container>
      {pluginTabs.length > 1 && (
        <TabContainer>
          {pluginTabs.map(({ options }: PluginElementData, i: number) => (
            <TabButton key={options.title} onClick={() => setTab(i)} disabled={tab === i}>
              {options.title}
            </TabButton>
          ))}
        </TabContainer>
      )}

      <TabComponent plugin={tabPlugin} />
    </Container>
  );
};

export default HomeTabs;
