import React, { useState } from 'react';
import styled from 'styled-components';
import Clipboard from '../../components/Clipboard';
import Button from '../../components/Button';

const StyledWrapper = styled.div`
  & {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    position: relative;
  }
`;

const StyledInput = styled.input`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: none;

  background-color: white;
  padding: 16px;
  width: 100%;
  height: 3rem;
  border: 1px;
  border-color: grey;
  border-radius: 1px;
  font-family: sans-serif;
  font-size: 1rem;
  outline: none;
`;

const ButtonContainer = styled.div`
  margin-right: 8px;
  display: flex;
  position: absolute;
  right: 0px;
`;

interface PrivateKeyProps {
  privateKey: string;
}

const PrivateKeyField: React.FC<PrivateKeyProps> = ({ privateKey }) => {
  const [visibleKey, setVisibleKey] = useState(false);

  return (
    <StyledWrapper>
      <StyledInput
        readOnly
        value={privateKey}
        type={visibleKey ? 'text' : 'password'}
        onFocus={() => setVisibleKey(true)}
        onBlur={() => setVisibleKey(false)}
      />

      <ButtonContainer>
        <Clipboard text={privateKey}>
          {(isCopied: boolean) => (
            <Button>{!isCopied ? 'Copy' : 'Copied!'}</Button>
          )}
        </Clipboard>
      </ButtonContainer>
    </StyledWrapper>
  );
};

export default PrivateKeyField;
