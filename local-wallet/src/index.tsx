import React from 'react';
import ReactDOM from 'react-dom';
import { NativeAsset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { HTTPGateway } from '@burner-wallet/core/gateways';
import BurnerUI from '@burner-wallet/ui';
import LegacyPlugin from '@burner-wallet/legacy-plugin';

const core = new BurnerCore({
  signers: [
    new InjectedSigner(),
    new LocalSigner({ privateKey: process.env.REACT_APP_PK, saveKey: false }),
  ],
  gateways: [
    new HTTPGateway('http://localhost:8545', '5777'),
  ],
  assets: [
    new NativeAsset({ id: 'geth', name: 'Ganache ETH', network: '5777' }),
  ],
});

const BurnerWallet = () =>
  <BurnerUI
    title="Local Wallet"
    core={core}
    plugins={[new LegacyPlugin()]}
  />


ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
