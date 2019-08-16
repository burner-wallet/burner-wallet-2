import React, { Component, ComponentType } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import HistoryEvent from '@burner-wallet/core/HistoryEvent';
import { Diff } from './';

interface HistoryProviderProps {
  core: any,
}

type HistoryEventCallback = (event: HistoryEvent) => void;

interface HistoryFns {
  getHistoryEvents: (options: any) => HistoryEvent[],
  onHistoryEvent: (callback: HistoryEventCallback) => void,
  removeHistoryEventListener: (callback: HistoryEventCallback) => void,
}

export interface HistoryContext {
  historyFns: HistoryFns,
}

const unavailable = () => { throw new Error('Unavailable') };
const { Provider, Consumer } = React.createContext<HistoryContext>({
  historyFns: {
    getHistoryEvents: () => { throw new Error('Not Ready') },
    onHistoryEvent: () => { throw new Error('Not Ready') },
    removeHistoryEventListener: () => { throw new Error('Not Ready') },
  },
});

export default class HistoryProvider extends Component<HistoryProviderProps, any> {
  private historyFns: HistoryFns;

  constructor(props: HistoryProviderProps) {
    super(props);
    this.historyFns = {
      getHistoryEvents: (options: any) => props.core.getHistoryEvents(options),
      onHistoryEvent: (cb: HistoryEventCallback) => props.core.onHistoryEvent(cb),
      removeHistoryEventListener: (cb: HistoryEventCallback) =>
        props.core.removeHistoryEventListener(cb),
    };
  }

  render() {
    return (
      <Provider value={{ historyFns: this.historyFns }}>
        {this.props.children}
      </Provider>
    )
  }
}

export function withHistory<P>(WrappedComponent: ComponentType<P>): ComponentType<Diff<P, HistoryContext>> {
  return function(props) {
    return (
      <Consumer>
        {(burnerContext: HistoryContext) => <WrappedComponent {...burnerContext} {...props as P} />}
      </Consumer>
    )
  }
}
