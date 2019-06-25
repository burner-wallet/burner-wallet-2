import React from 'react';
import { Account } from '../types';
import AddressInputAccount from './AddressInputAccount';
const classes = require('./AddressInputSearchResults.module.css');

interface AddressInputSearchResultsProps {
  accounts: Account[],
  onSelect: (account: Account) => void,
}

const AddressInputSearchResults: React.FC<AddressInputSearchResultsProps> = ({ accounts, onSelect }) => (
  <div className={classes.results}>
    <ul className={classes.list}>
      {accounts.map(account => (
        <li
          className={`${classes.listElement} ${account.address ? classes.enabled : ''}`}
          onClick={() => account.address && onSelect(account)}
          key={account.address || account.name}
        >
          <AddressInputAccount account={account}/>
        </li>
      ))}
    </ul>
  </div>
);

export default AddressInputSearchResults;
