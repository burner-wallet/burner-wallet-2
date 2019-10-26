import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Icon } from 'rimble-ui';
import Page from '../../components/Page';
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

const StyledInput = styled(Input)`
  text-overflow: ellipsis;
  white-space: nowrap;
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
        width={1}
        fontWeight={3}
        type={visibleKey ? 'text' : 'password'}
      />

      <ButtonContainer>
        <Button onClick={() => setVisibleKey(!visibleKey)}>
          <Icon name={visibleKey ? 'VisibilityOff' : 'Visibility'} />
        </Button>
        
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
