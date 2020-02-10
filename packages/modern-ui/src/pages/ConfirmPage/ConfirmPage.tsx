import React, { useState } from 'react';
import { useBurner } from '@burner-wallet/ui-core';
import { RouteComponentProps } from 'react-router-dom';
import Address from '../../components/Address';
import Button from '../../components/Button';
import Page from '../../components/Page';
import LineItem from '../../components/LineItem';

const ConfirmPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { BurnerComponents, assets, actions, pluginData, t } = useBurner();
  const { PluginElements } = BurnerComponents;

  const [sending, _setSending] = useState(false);
  const setSending = (isSending: boolean) => {
    _setSending(isSending);
    actions.setLoading(isSending ? 'Sending...' : null);
  }

  if (!history.location.state) {
    history.replace('/send');
    return null;
  }

  const {
    to,
    from,
    ether,
    value,
    asset: assetId,
    message,
    id
  } = history.location.state;
  const [asset] = assets.filter(a => a.id === assetId);

  const amount = ether || asset.getDisplayValue(value);

  const send = async () => {
    setSending(true);
    try {
      actions.setLoading('Sending...');
      const receipt = await asset.send({ from, to, ether, value, message });

      actions.setLoading(null);
      const redirect = pluginData.sent({
        asset: assetId,
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
    <Page title={t('Confirm')}>
      <PluginElements position="confirm-top" tx={history.location.state} />

      <LineItem name={t('From')}>
        <Address address={from} />
      </LineItem>
      <LineItem name={t('To')}>
        <Address address={to} />
      </LineItem>
      <LineItem name={t('Amount')} value={`${amount} ${asset.name}`} />
      {message && <LineItem name={t('Note')} value={message} />}

      <PluginElements position="confirm-middle" tx={history.location.state} />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button disabled={sending} onClick={() => history.goBack()}>
          {t('Cancel')}
        </Button>
        <Button disabled={sending} onClick={send}>{t('Send')}</Button>
      </div>

      <PluginElements position="confirm-bottom" tx={history.location.state} />
    </Page>
  );
};

export default ConfirmPage;
