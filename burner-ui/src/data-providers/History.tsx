import React, { useState, useEffect, Fragment } from 'react';
import HistoryEvent from '@burner-wallet/core/HistoryEvent';
import { withBurner, BurnerContext } from '../BurnerProvider';

interface HistoryProps extends BurnerContext {
  account: string,
  render: (events: HistoryEvent[]) => React.ReactNode,
}

const History: React.FC<HistoryProps> = ({ account, actions, render }) => {
  const [events, setEvents] = useState<HistoryEvent[]>([]);

  useEffect(() => {
    setEvents(actions.getHistoryEvents({ account }));

    const onHistoryEventCallback = (event: HistoryEvent) => {
      if (event.to === account || event.from === account) {
        setEvents([event, ...events]);
      }
    };

    actions.onHistoryEvent(onHistoryEventCallback)

    return () => actions.removeHistoryEventListener(onHistoryEventCallback)
  }, [account]);

  return (
    <Fragment>
      {render(events)}
    </Fragment>
  );
}

export default withBurner(History);
