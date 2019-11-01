import React, { useState, useEffect, Fragment } from 'react';
import { HistoryProps, HistoryEvent } from '@burner-wallet/types';
import { withBurner, BurnerContext } from '../BurnerProvider';

const History: React.FC<HistoryProps & BurnerContext> = ({ account, actions, render }) => {
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
