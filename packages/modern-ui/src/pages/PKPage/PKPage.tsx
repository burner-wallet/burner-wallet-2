import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Asset } from '@burner-wallet/types';
import { BurnerContext, withBurner } from '@burner-wallet/ui-core';
import Page from '../../components/Page';
import { pkToAddress, pkRegex, isAllZero } from '../../lib';
import MoveBalance from './MoveBalance';

interface State {
  newAddress: string;
  currentBalances: string[];
  newBalances: string[];
}

export const getAllBalances = (assets: Asset[], account: string) =>
  Promise.all(assets.map(asset => asset.getBalance(account)));

const moveAll = async (assets: Asset[], sender: string, recipient: string) => {
  const _assets = Array.from(assets).sort((asset: Asset) => asset.type === 'native' ? 1 : -1);
  for (const asset of _assets) {
    const balance = await asset.getMaximumSendableBalance(sender, recipient);
    if (balance !== '0') {
      await asset.send({
        to: recipient,
        from: sender,
        value: balance,
      });
    }
  }
};

const PKPage: React.FC<BurnerContext & RouteComponentProps> = ({ history, assets, actions, defaultAccount }) => {
  const getPK = () => {
    if (window.location.hash.length > 1) {
      const hash = window.location.hash.substr(1);
      if (pkRegex.test(hash)) {
        return hash;
      }
    }
    if (history.location.state.newPK) {
      return history.location.state.newPK;
    }
    return null;
  };

  const [status, setStatus] = useState('loading');
  const [state, setState] = useState<State | null>(null);

  const pk = getPK();

  const setPK = async (pk: string) => {
    await actions.callSigner('writeKey', defaultAccount, pk);
    history.push('/');
  }

  const tryToSetKey = async () => {
    if (!pk) {
      setStatus('invalid');
    }

    const canSetPK = actions.canCallSigner('writeKey', defaultAccount, pk);
    if (!canSetPK) {
      setStatus('unavailable');
    }

    const newAddress = actions.canCallSigner('keyToAddress', defaultAccount)
      ? actions.callSigner('keyToAddress', defaultAccount, pk)
      : pkToAddress(pk); // This can be removed once enough wallets have upgraded to core@^1.1.5
    if (newAddress.toLowerCase() === defaultAccount.toLowerCase()) {
      history.push('/');
      return;
    }

    const currentBalances = await getAllBalances(assets, defaultAccount);
    if (isAllZero(currentBalances)) {
      setPK(pk);
      return;
    }

    const newBalances = await getAllBalances(assets, newAddress);
    setState({ newAddress, currentBalances, newBalances });
    setStatus('balance');
  };

  useEffect(() => { tryToSetKey() }, [pk]);

  let content;
  switch (status) {
    case 'invalid':
      content = 'Invalid private key';
      break;
    case 'unavailable':
      content = 'Unable to change private key';
      break;
    case 'balance':
      const _state = state as State;
      console.log(_state);
      content = (
        <MoveBalance
          assets={assets}
          currentAddress={defaultAccount}
          newAddress={_state.newAddress}
          currentBalances={_state.currentBalances}
          newBalances={_state.newBalances}
          onMoveToCurrent={async () => {
            try {
              await actions.callSigner('enable', 'temp', pk);
              await moveAll(assets, _state.newAddress, defaultAccount);
              await actions.callSigner('disable', 'temp');
              setStatus('complete');
            } catch (e) {
              console.error(e);
            }
          }}
          onMoveToNew={async () => {
            await moveAll(assets, defaultAccount, _state.newAddress);
            setPK(pk);
            setStatus('complete');
          }}
          discardOld={() => setPK(pk)}
          cancel={() => actions.navigateTo('/')}
        />
      );
      break;
    case 'complete':
      content = 'Key imported';
      break;
    default:
      content = null;
  }

  return (
    <Page title="Change Accounts">{content}</Page>
  );
}

export default withBurner(PKPage);

