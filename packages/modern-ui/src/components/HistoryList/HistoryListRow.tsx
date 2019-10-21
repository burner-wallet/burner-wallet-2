import React from 'react';
import { Asset } from '@burner-wallet/assets';
import HistoryEvent from '@burner-wallet/core/HistoryEvent';
import { DataProviders } from '@burner-wallet/ui-core';
import { PluginElementsProps } from '@burner-wallet/types';
import styled from 'styled-components';

const { PluginElements } = DataProviders;

const HistoryPluginElements = PluginElements as React.FC<
  PluginElementsProps & { event: HistoryEvent }
>;

const Row = styled.div`
  border-top: 1px solid #f2f2f2;
  display: flex;
  justifyContent: space-between;
`;

interface HistoryListEventProps {
  event: HistoryEvent;
  account?: string;
  navigateTo: (path: string) => void;
}

const HistoryListRow: React.FC<HistoryListEventProps> = ({ event, account, navigateTo }) => {
  let type;
  const asset = event.getAsset();
  if (!asset) {
    console.warn(`Could not find asset ${event.asset}`);
    return null;
  }

  switch (event.type) {
    case 'send':
      return (
        <Row onClick={() => navigateTo(`/receipt/${asset.id}/${event.tx}`)}>
          <div>
            <span>
              {event.to.substring(0, 8)} ...{' '}
              {event.to.substring(event.to.length - 8, event.to.length)}
            </span>
            <div>
              {event.to === account ? 'Received funds' : 'Sent funds'}
            </div>
          </div>

          <div>
            <div style={{ color: event.to === account ? '#28C081' : '#FD9D28' }}>
              {event.to === account
                ? (<span style={{ color: '#28C081' }}>{'\u2199'}</span>)
                : (<span style={{ color: '#FD9D28' }}>{'\u2197'}</span>)}
              {asset.getDisplayValue(event.value)}
            </div>
            <div>
              {asset.name}
            </div>
          </div>
        </Row>
      );
    case 'exchange':
      type = 'Exchange';
      break;
    default:
      console.warn('Unknown event type', event.type);
  }
  return null;
};

export default HistoryListRow;
