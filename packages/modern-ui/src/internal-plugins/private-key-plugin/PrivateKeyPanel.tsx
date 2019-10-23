import React, { Fragment } from 'react';
import styled from 'styled-components';
import { BurnerContext } from '@burner-wallet/ui-core';
import { Keys } from '@burner-wallet/types';
import PrivateKeyField from './PrivateKeyField';
import { DataProviders } from '@burner-wallet/ui-core';
import Button from '../../components/Button';

const AdvancedButton = styled(Button)`
  margin-top: 16px;
  width: 100%;
`;

const { AccountKeys } = DataProviders;

const PrivateKeyPanel: React.FC<BurnerContext> = ({ defaultAccount }) => {
  return (
    <section>
      <h2>Private Key</h2>
      <AccountKeys
        account={defaultAccount}
        render={(keys: Keys | null) =>
          keys ? (
            <Fragment>
              <PrivateKeyField privateKey={keys.privateKey} />
              <AdvancedButton outline variant="danger" onClick={keys.burnAccount}>
                Burn Account
              </AdvancedButton>
            </Fragment>
          ) : (
            <div>Private key unavailable while using a web3 browser such as Metamask</div>
          )
        }
      />
    </section>
  );
};

export default PrivateKeyPanel;
