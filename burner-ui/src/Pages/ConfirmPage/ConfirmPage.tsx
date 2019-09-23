import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BurnerContext, withBurner } from '../../BurnerProvider';
import Button from '../../components/Button';
import Page from '../../components/Page';
import LineItem from '../../components/LineItem';

const ConfirmPage: React.FC<BurnerContext & RouteComponentProps> = ({ history, assets, actions, pluginData }) => {
  if (!history.location.state) {
    history.replace('/send');
    return null;
  }

  const [sending, setSending] = useState(false);

  const { to, from, ether, value, asset: assetId, message, id } = history.location.state;
  const [asset] = assets.filter(a => a.id === assetId);

  const amount = ether || asset.getDisplayValue(value);

  const send = async () => {
    setSending(true);
    try {
      actions.setLoading('Sending...');
      const receipt = await asset.send({ from, to, ether, value, message });

      actions.setLoading(null);
      const redirect = pluginData.sent({
        asset,
        from,
        to,
        ether: amount,
        message,
        receipt,
        hash: receipt.transactionHash,
        id,
      });

      history.push(redirect || `/receipt/${asset.id}/${receipt.transactionHash}`);
    } catch (err) {
      setSending(false);
      console.error(err);
    }
  };

  return (
    <Page title="Confirm">
      <LineItem name="From" value={from} />
      <LineItem name="To" value={to} />
      <LineItem name="Amount" value={`${amount} ${asset.name}`} />
      {message && <LineItem name="Message" value={message} />}

      <div style={{ display: 'flex' }}>
        <Button disabled={sending} onClick={send}>Send</Button>
        <Button disabled={sending} onClick={() => history.goBack()}>Cancel</Button>
      </div>
    </Page>
  );
};

export default withBurner(ConfirmPage);
