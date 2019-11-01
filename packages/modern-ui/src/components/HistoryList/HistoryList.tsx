import React from 'react';
import { HistoryEvent } from '@burner-wallet/types';
import { DataProviders } from '@burner-wallet/ui-core';
import HistoryListRow from './HistoryListRow';

const { History } = DataProviders;

interface HistoryListProps {
  account: string;
  limit?: number;
  navigateTo: (path: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ account, limit, navigateTo }) => {
  return (
    <History
      account={account}
      render={(events: HistoryEvent[]) => {
        if (events.length === 0) {
          return (
            <div>No recent activity</div>
          );
        }

        return events
          .slice(0, limit)
          .map((event: HistoryEvent) => (
            <HistoryListRow
              key={event.id}
              event={event}
              account={account}
              navigateTo={navigateTo}
            />
          ))
      }}
    />
  );
};

HistoryList.defaultProps = {
  limit: 100,
};

export default HistoryList;
