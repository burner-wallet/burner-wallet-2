import React, { ChangeEvent, Fragment } from 'react';
import { Account } from '@burner-wallet/types';
import { Input, Icon, Button } from 'rimble-ui';
import styled from 'styled-components';
import AddressInputAccount from './AddressInputAccount';

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
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  width: 100%;
  max-width: 320px;
  position: relative;
`;

const StyledInput = styled(Input)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value, null)}
            disabled={disabled}
          />
          <ButtonContainer>
            {scan && (
              <Button onClick={scan}>
                <Icon name='CenterFocusWeak' />
              </Button>
            )}
          </ButtonContainer>
        </Fragment>
      )}
    </StyledWrapper>
  );
};

export default AddressInputField;
