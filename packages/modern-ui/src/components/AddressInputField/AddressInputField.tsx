import React, { ChangeEvent, Fragment, useState, useRef } from 'react';
import { Account } from '@burner-wallet/types';
import { Input, Icon, Button } from 'rimble-ui';
import styled from 'styled-components';
import AddressInputAccount from './AddressInputAccount';
import SuggestedAddressDropdown from './SuggestedAddressDropdown';

const ADDRESS_REGEX = /^(0x)?[0-9a-f]{40}$/i;

const ButtonClear = styled.button`
  font-size: 32px;
  color: var(--color-primary);
  background: transparent;
  border: 0px;
  outline: none;
`;

const ButtonContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  width: 100%;
  position: relative;
`;

const StyledInput = styled(Input)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  color: rgb(63, 61, 75);
  background-color: #ffffff;
  width: 100%;
  height: 3rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
  font-family: "Source Sans Pro", -apple-system, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1;
  padding: 16px;
  border: solid 1px rgb(204, 204, 204);
  border-radius: 4px;
`;

const ScanButton = styled(Button)`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
  font-family: "Source Sans Pro", -apple-system, sans-serif;
  font-weight: 600;
  font-size: 0.75rem;
  height: 2rem;
  min-width: 2rem;
  margin: 0px 8px;
  border: none;
  border-radius: 4px;
  background: #1AAA9B;
  padding: 0;
`;

interface AddressInputFieldProps {
  value: string;
  account?: Account | null;
  onChange: (address: string, account: Account | null) => void;
  scan?: () => any;
  disabled?: boolean;
}

const AddressInputField: React.FC<AddressInputFieldProps> = ({
  value, account, onChange, scan, disabled
}) => {
  const [focused, setFocused] = useState(false);
  const anchor = useRef<HTMLElement | null>(null);

  let _account = account;
  if (!account && ADDRESS_REGEX.test(value)) {
    _account = { address: value };
  }
  return (
    <StyledWrapper>
      {_account ? (
        <Fragment>
          <AddressInputAccount account={_account} />
          <ButtonClear onClick={() => onChange('', null)}>
            {'\u00D7'}
          </ButtonClear>
        </Fragment>
      ) : (
        <Fragment>
          <StyledInput
            value={value}
            ref={anchor}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value, null)}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <ButtonContainer>
            {scan && (
              <ScanButton onClick={scan}>
                <Icon name='CenterFocusWeak' />
              </ScanButton>
            )}
          </ButtonContainer>

          {focused && anchor.current && (
            <SuggestedAddressDropdown
              search={value}
              anchor={anchor.current}
              onSelect={(account: Account) => {
                onChange(account.address, account);
                setFocused(false);
              }}
            />
          )}
        </Fragment>
      )}
    </StyledWrapper>
  );
};

export default AddressInputField;
