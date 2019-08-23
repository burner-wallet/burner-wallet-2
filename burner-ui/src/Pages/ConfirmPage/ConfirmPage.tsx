import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BurnerContext, withBurner } from '../../BurnerProvider';
import Button from '../../components/Button';
import Page from '../../components/Page';
import LineItem from '../../components/LineItem';

const ConfirmPage: React.FC<BurnerContext & RouteComponentProps> = ({ history, assets }) => {
  if (!history.location.state) {
    history.replace('/send');
    return null;
  }

  const [sending, setSending] = useState(false);

  const { to, from, ether, asset, message } = history.location.state;
  const [_asset] = assets.filter(a => a.id === asset);

  const send = async () => {
    setSending(true);
    try {
      const receipt = await _asset.send({ from, to, ether, message });
      history.push(`/receipt/${_asset.id}/${receipt.transactionHash}`);
    } catch (err) {
      setSending(false);
      console.error(err);
    }
  };

  return (
    <Page title="Confirm">
      <LineItem name="From" value={from} />
      <LineItem name="To" value={to} />
      <LineItem name="Amount" value={`${ether} ${_asset.name}`} />
      {message && <LineItem name="Message" value={message} />}

      <div style={{ display: 'flex' }}>
        <Button disabled={sending} onClick={send}>Send</Button>
        <Button disabled={sending} onClick={() => history.goBack()}>Cancel</Button>
      </div>
    </Page>
  );
};

export default withBurner(ConfirmPage);
