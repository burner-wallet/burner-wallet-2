import React, { Fragment } from 'react';
import { Account } from '../types';
import AddressInputAccount from './AddressInputAccount';
const classes = require('./AddressInputField.module.css');

const ADDRESS_REGEX = /^(0x)?[0-9a-f]{40}$/i;

interface AddressInputFieldProps {
  value: string,
  account?: Account | null,
  onChange: (address: string, account: Account | null) => void,
  scan?: () => any,
  disabled?: boolean,
}

const AddressInputField: React.FC<AddressInputFieldProps> = ({ value, account, onChange, scan, disabled }) => {
  let _account = account;
  if (!account && ADDRESS_REGEX.test(value)) {
    _account = { address: value };
  }
  return (
    <div className={classes.inputContainer}>
      {_account ? (
        <Fragment>
          <AddressInputAccount account={_account} />
          <button onClick={() => onChange('', null)}>X</button>
        </Fragment>
      ) : (
        <Fragment>
          <input
            className={classes.textField}
            value={value}
            onChange={e => onChange(e.target.value, null)}
          />
          {scan && <button onClick={scan}>Scan</button>}
        </Fragment>
      )}
    </div>
  );
}

export default AddressInputField;
