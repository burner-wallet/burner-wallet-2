import React, { useState, useEffect } from 'react';
import { withBurner } from '@burner-wallet/ui-core';
import { BurnerPluginData, Account } from '@burner-wallet/types';
import styled from 'styled-components';
import Popup from '../Popup';
import AddressInputAccount from './AddressInputAccount';

const DropdownContainer = styled.div`
  background: #eeeeee;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  border: solid 1px #dbdbdb;
  border-top: none;
`;

const SuggestionContainer = styled.div`
  &:hover {
    background: #e1deff;
  }
`;

interface SuggestedAddressProps {
  search: string;
  anchor: HTMLElement;
  onSelect: (account: Account) => void;
  pluginData: BurnerPluginData;
}

const SuggestedAddressDropdown: React.FC<SuggestedAddressProps> = ({ search, anchor, pluginData, onSelect }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    let canceled = false;

    Promise.all(pluginData.accountSearches.map(searchFn => searchFn(search)))
      .then((_accounts: Account[][]) => {
        if (!canceled) {
          const flattenedAccounts = Array.prototype.concat(..._accounts);
          setAccounts(flattenedAccounts);
        }
      });

    return () => {
      canceled = true;
    };
  }, [search]);

  if (accounts.length === 0) {
    return null;
  }

  return (
    <Popup anchor={anchor}>
      <DropdownContainer>
        {accounts.map((account: Account) => (
          <SuggestionContainer key={account.address} onMouseDown={() => onSelect(account)}>
            <AddressInputAccount account={account} />
          </SuggestionContainer>
        ))}
      </DropdownContainer>
    </Popup>
  );
};

export default withBurner(SuggestedAddressDropdown);
