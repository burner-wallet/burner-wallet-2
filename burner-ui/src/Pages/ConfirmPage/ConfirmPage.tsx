import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BurnerContext, withBurner } from '../../BurnerProvider';
import Page from '../../components/Page';

const ConfirmPage: React.FC<BurnerContext & RouteComponentProps> = ({ history, assets }) => {
  if (!history.location.state) {
    history.replace('/send');
    return null;
  }

  const [sending, setSending] = useState(false);

  const { to, from, ether, asset } = history.location.state;
  const [_asset] = assets.filter(a => a.id === asset);

  const send = async () => {
    setSending(true);
    try {
      const receipt = await _asset.send({ from, to, ether: ether });
      history.push(`/receipt/${_asset.id}/${receipt.transactionHash}`);
    } catch (err) {
      setSending(false);
      console.error(err);
    }
  };

  return (
    <Page title="Confirm">
      <div>To: {to}</div>
      <div>From: {from}</div>
      <div>Amount: {ether} {_asset.name}</div>
      <div>
        <button disabled={sending} onClick={send}>Send</button>
        <button disabled={sending} onClick={() => history.goBack()}>Cancel</button>
      </div>
    </Page>
  );
};

export default withBurner(ConfirmPage);
