import React, { Fragment } from 'react';
import injectSheet from 'react-jss';
import { Account } from '@burner-wallet/ui-core';
import AddressInputAccount from './AddressInputAccount';
import { SCAN_QR_DATAURI } from '../constants';

const ADDRESS_REGEX = /^(0x)?[0-9a-f]{40}$/i;

const styles = {
  inputContainer: {
    border: 'solid 1px #CCCCCC',
    borderRadius: 4,
    display: 'flex',
    padding: 1,
    height: 40,
  },
  textField: {
    border: 'none',
    flex: '1 0',
    fontSize: 16,
    padding: 4,
  },
  scanBtn: {
    backgroundImage: `url("${SCAN_QR_DATAURI}")`,
    width: 40,
    height: 40
  },
  clearBtn: {
    width: 40,
  },
};

interface AddressInputFieldProps {
  value: string;
  account?: Account | null;
  onChange: (address: string, account: Account | null) => void;
  scan?: () => any;
  disabled?: boolean;
  classes: any;
}

const AddressInputField: React.FC<AddressInputFieldProps> = ({
  value, account, onChange, scan, disabled, classes
}) => {
  let _account = account;
  if (!account && ADDRESS_REGEX.test(value)) {
    _account = { address: value };
  }
  return (
    <div className={classes.inputContainer}>
      {_account ? (
        <Fragment>
          <AddressInputAccount account={_account} />
          <button onClick={() => onChange('', null)} className={classes.clearBtn}>{'\u00D7'}</button>
        </Fragment>
      ) : (
        <Fragment>
          <input
            className={classes.textField}
            value={value}
            onChange={e => onChange(e.target.value, null)}
            disabled={disabled}
          />
          {scan && <button className={classes.scanBtn} onClick={scan} />}
        </Fragment>
      )}
    </div>
  );
}

export default injectSheet(styles)(AddressInputField);
