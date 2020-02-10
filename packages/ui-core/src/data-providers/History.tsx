import React, { useState, useEffect, Fragment } from 'react';
import { HistoryProps, HistoryEvent } from '@burner-wallet/types';
import { useBurner } from '../BurnerProvider';

const History: React.FC<HistoryProps> = ({ account, render }) => {
  const { actions, defaultAccount } = useBurner();

  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const _account = account || defaultAccount;

  useEffect(() => {
    const _events = actions.getHistoryEvents({ account: _account });
    setEvents(_events);

    const onHistoryEventCallback = (event: HistoryEvent) => {
      if (event.to.toLowerCase() === _account.toLowerCase()
        || event.from.toLowerCase() === _account.toLowerCase()) {
        _events.unshift(event);
        setEvents(_events);
      }
    };

    actions.onHistoryEvent(onHistoryEventCallback);

    return () => {
      actions.removeHistoryEventListener(onHistoryEventCallback);
    };
  }, [_account]);

  return (
    <Fragment>
      {render(events)}
    </Fragment>
  );
}

export default History;
