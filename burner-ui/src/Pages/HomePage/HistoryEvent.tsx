import React from 'react';
import { Asset } from '@burner-wallet/assets';
const classes = require('./HistoryEvent.module.css');

interface HistoryEventProps {
  event: any,
  account?: string,
}

const HistoryEvent: React.FC<HistoryEventProps> = ({ event, account }) => {
  const asset = event.getAsset() as Asset;
  if (!asset) {
    console.warn(`Could not find asset ${event.asset}`)
    return null;
  }

  let type;
  switch (event.type) {
    case 'send':
      type = event.to === account ? 'Receive' : 'Send';
      break;
    case 'exchange':
      type = 'Exchange';
      break
    default:
      console.warn('Unknown event type', event.type);
  }

  return (
    <div className={classes.container}>
      <div>{type}</div>
      <div className={classes.address} title={event.from}>{event.from}</div>
      <div className={classes.value}>{asset.getDisplayValue(event.value)} {asset.name}</div>
      <div className={classes.address} title={event.to}>{event.to}</div>
    </div>
  );
}

export default HistoryEvent;
