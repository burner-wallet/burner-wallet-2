import React, { Fragment } from 'react';
import injectSheet from 'react-jss';
import { Asset } from '@burner-wallet/assets';
import PluginElements from '../../components/PluginElements';

const styles = {
  container: {
    display: 'flex',
    background: '#d9d9d9',
    padding: 6,
    borderRadius: 12,
    margin: '4px 0',
    alignItems: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  address: {
    fontFamily: 'monospace',
    margin: '0 4px',
  },
  value: {
    whiteSpace: 'nowrap',
  },
  details: {
    flex: '1 0',
    overflow: 'hidden',
  },
  mainDetail: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  type: {
    minWidth: 64,
    fontSize: 18,
    marginRight: 12,
  },
  subDetail: {
    fontSize: 14,
  },
};

interface HistoryEventProps {
  event: any,
  account?: string,
  classes: any,
}

const HistoryEvent: React.FC<HistoryEventProps> = ({ event, account, classes }) => {
  const asset = event.getAsset() as Asset;
  if (!asset) {
    console.warn(`Could not find asset ${event.asset}`)
    return null;
  }

  let type;
  let main;
  let subDetail = null;
  switch (event.type) {
    case 'send':
      const isReceive = event.to === account;
      type = isReceive ? 'Receive' : 'Send';
      main = (
        <Fragment>
          {isReceive ? 'From: ' : 'To: '}
          <span className={classes.address} title={isReceive ? event.from : event.to}>
            {isReceive ? event.from : event.to}
          </span>
        </Fragment>
      );
      if (event.message && event.message.length > 0) {
        subDetail = event.message;
      }
      break;
    case 'exchange':
      type = 'Exchange';
      break
    default:
      console.warn('Unknown event type', event.type);
  }

  return (
    <div className={classes.container}>
      <div className={classes.type}>{type}</div>
      <div className={classes.details}>
        <div className={classes.mainDetail}>{main}</div>
        {subDetail && (
          <div className={classes.subDetail}>{subDetail}</div>
        )}
      </div>
      <div className={classes.value}>{asset.getDisplayValue(event.value)} {asset.name}</div>
      <PluginElements position="history-event" event={event} />
    </div>
  );
}

export default injectSheet(styles)(HistoryEvent);
