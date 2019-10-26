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
  justify-content: space-between;
  padding: 4px;

  &:first-child {
    border-top: none;
  }

  &:hover {
    background: rgba(181, 181, 181, .1);
    cursor: pointer;
  }
`;

const RightSide = styled.div`text-align: right;`;

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

          <RightSide>
            <div style={{ color: event.to === account ? '#28C081' : '#FD9D28' }}>
              {event.to === account ? '\u2199' : '\u2197'}
              {asset.getDisplayValue(event.value)}
            </div>
            <div>{asset.name}</div>
          </RightSide>
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
