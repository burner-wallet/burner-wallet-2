import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Keys, PluginElementContext } from '@burner-wallet/types';
import { DataProviders } from '@burner-wallet/ui-core';
import Button from '../../components/Button';
import { randomHex } from '../../lib';
import ImportPK from './ImportPK';
import PrivateKeyField from './PrivateKeyField';

const AdvancedButton = styled(Button)`
  margin-top: 16px;
  width: 100%;
`;

const { AccountKeys } = DataProviders;

const PrivateKeyPanel: React.FC<PluginElementContext> = ({ actions, defaultAccount, t }) => {
  return (
    <section>
      <h2>Private Key</h2>
      <AccountKeys
        account={defaultAccount}
        render={(keys: Keys | null) => {
          if (keys) {
            return (
              <Fragment>
                <PrivateKeyField privateKey={keys.privateKey} />

                <ImportPK onImport={(newPk: string) => actions.safeSetPK(newPk)} />

                <AdvancedButton onClick={() => actions.safeSetPK(randomHex(64))}>
                  {t('Burn Account')}
                </AdvancedButton>
              </Fragment>
            );
          }

          if (actions.canCallSigner('writeKey', defaultAccount)) {
            return (
              <AdvancedButton onClick={() => actions.safeSetPK(randomHex(64))}>
                {t('Burn Account')}
              </AdvancedButton>
            );
          }

          return (
            <div>Private key unavailable while using a web3 browser such as Metamask</div>
          );
        }}
      />
    </section>
  );
};

export default PrivateKeyPanel;
