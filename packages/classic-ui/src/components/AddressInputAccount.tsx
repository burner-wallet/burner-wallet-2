import React from 'react';
import { Account } from '@burner-wallet/ui-core';
const classes = require('./AddressInputAccount.module.css');

const AddressInputAccount: React.FC<{account: Account}> = ({ account }) => (
  <div className={classes.account}>
    {account.picture && (
      <div className={classes.avatar} style={{ backgroundImage: `url(${account.picture})` }} />
    )}
    <div className={classes.names}>
      <div className={classes.title}>{account.name || account.address}</div>
      {account.name && <div className={classes.subtitle}>{account.address}</div>}
    </div>
  </div>
);

export default AddressInputAccount;
