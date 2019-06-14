import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import BurnerCore from '../../../burner-core/core';
import { xdai, dai, eth } from '../../../burner-core/assets';
import { InjectedSigner, LocalSigner } from '../../../burner-core/core/src/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway } from '../../../burner-core/core/src/gateways';
import Exchange from '../../exchange';
import { xdaiBridge, uniswapDai } from '../../exchange/src/pairs';
import BurnerUI from '../../burner-ui';

const core = new BurnerCore({
  signers: [new InjectedSigner(), new LocalSigner()],
  gateways: [
    new InjectedGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
});

const exchange = new Exchange({
  pairs: [xdaiBridge, uniswapDai],
});

const BurnerWallet = () =>
  <BurnerUI
    core={core}
    assets={[xdai, dai, eth]}
    plugins={[exchange]}
  />



ReactDOM.render(<BurnerWallet />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
