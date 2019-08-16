import React, { Component, useState, useEffect, Fragment } from 'react';
import HistoryEvent from '@burner-wallet/core/HistoryEvent';
import { withHistory, HistoryContext } from '../HistoryProvider';

interface HistoryProps extends HistoryContext {
  account: string,
  render: (events: HistoryEvent[]) => React.ReactNode,
}

interface HistoryState {
  events: HistoryEvent[],
}

class History extends Component<HistoryProps, HistoryState> {
  private onHistoryEventCallback: (event: HistoryEvent) => void;

  constructor(props: HistoryProps) {
    super(props);
    this.state = {
      events: [],
    };

    this.onHistoryEventCallback = (event: HistoryEvent) => {
      const { account } = this.props;
      if (event.to === account || event.from === account) {
        this.setState({
          events: [event, ...this.state.events],
        });
      }
    }
  }

  componentDidMount() {
    const { account, historyFns } = this.props;
    this.setState({
      events: [...historyFns.getHistoryEvents({ account })],
    });

    historyFns.onHistoryEvent(this.onHistoryEventCallback);
  }

  componentWillUnmount() {
    this.props.historyFns.removeHistoryEventListener(this.onHistoryEventCallback);
  }

  render() {
    return (
      <Fragment>
        {this.props.render(this.state.events)}
      </Fragment>
    );
  }
}

export default withHistory(History);
