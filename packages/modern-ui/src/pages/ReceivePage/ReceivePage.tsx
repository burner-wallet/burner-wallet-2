import React from 'react';
import styled from 'styled-components';
import { withBurner, BurnerContext } from '@burner-wallet/ui-core';
import { Input, Icon, QR } from 'rimble-ui';
import Clipboard from '../../components/Clipboard';
import Button from '../../components/Button';
import Page from '../../components/Page';

const QRContainer = styled.div`
  width: 80%;
  margin: auto;
  padding: 20px;
  flex: 1;

  & svg {
    width: 100%;
    height: 100%;
  }
`;

const AddressInputContainer = styled.div`
  display: flex;
`;

const CopyButton = styled(Button)`
  width: 200px;
  position: absolute;
  right: 0;
`;

const StyledInput = styled(Input)`
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ReceivePage: React.FC<BurnerContext> = ({ defaultAccount }) => {
  return (
    <Page title="Your Address">
      <div>Scan this code with your wallet to send money to it.</div>

      <QRContainer>
        <QR value={defaultAccount}/>
      </QRContainer>

      <AddressInputContainer>
        <StyledInput
          readOnly
          value={defaultAccount}
          width={1}
          pr="5rem"
          fontWeight={3}
        />
        <Clipboard text={defaultAccount}>
          {isCopied => (
            <CopyButton>{isCopied ? <Icon name="Check" /> : 'Copy'}</CopyButton>
          )}
        </Clipboard>
      </AddressInputContainer>

      <Button disabled>Create Request</Button>
    </Page>
  );
};

export default withBurner(ReceivePage);
