import React, { Component, ComponentType } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import HistoryEvent from '@burner-wallet/core/HistoryEvent';
import { BurnerComponents } from './components/burnerComponents';
import { BurnerPluginData, DEFAULT_PLUGIN_DATA } from './Plugins';
import { Diff } from './';
import { ZERO_ADDR } from './constants';

interface BurnerProviderProps extends RouteComponentProps {
  core: BurnerCore,
  pluginData: BurnerPluginData,
  children: React.ReactNode,
  burnerComponents: BurnerComponents,
}

export interface SendParams {
  asset: string,
  ether?: string,
  value?: string,
  to: string,
  from?: string,
  message?: string | null,
  id?: string | null,
}

type HistoryEventCallback = (event: HistoryEvent) => void;

export interface Actions {
  callSigner: (action: string, ...props: any[]) => string,
  canCallSigner: (action: string, ...props: any[]) => boolean,
  scanQrCode: () => Promise<string>,
  safeSetPK: (newPK: string) => void,
  send: (params: SendParams) => void,
  navigateTo: (location: string | number, state?: any) => void,
  setLoading: (status: string | null) => void,
  getHistoryEvents: (options?: any) => HistoryEvent[],
  onHistoryEvent: (callback: HistoryEventCallback) => void,
  removeHistoryEventListener: (callback: HistoryEventCallback) => void,
}

export interface BurnerContext {
  actions: Actions,
  accounts: string[],
  defaultAccount: string,
  assets: Asset[],
  burnerComponents: BurnerComponents,
  pluginData: BurnerPluginData,
  completeScan: ((result: string | null) => any) | null,
  loading: string | null,
}

interface BurnerProviderState {
  accounts: string[],
  completeScan: ((result: string | null) => any) | null,
  loading: string | null,
}

const unavailable = () => { throw new Error('Unavailable') };
const { Provider, Consumer } = React.createContext<BurnerContext>({
  actions: {
    callSigner: unavailable,
    canCallSigner: unavailable,
    navigateTo: unavailable,
    scanQrCode: unavailable,
    safeSetPK: unavailable,
    send: unavailable,
    setLoading: unavailable,
  },
  assets: [],
  accounts: [],
  defaultAccount: ZERO_ADDR,
  pluginData: DEFAULT_PLUGIN_DATA,
  burnerComponents: {} as BurnerComponents,
  completeScan: null,
  loading: null,
});

class BurnerProvider extends Component<BurnerProviderProps, BurnerProviderState> {
  private actions: Actions;

  constructor(props: BurnerProviderProps) {
    super(props);

    this.actions = {
      scanQrCode: this.scanQrCode.bind(this),
      canCallSigner: props.core.canCallSigner.bind(props.core),
      callSigner: props.core.callSigner.bind(props.core),
      safeSetPK: (newPK: string) => props.history.push('/pk', { newPK }),
      send: this.send.bind(this),
      navigateTo: (location: string | number, state?: any) =>
        Number.isInteger(location as number)
        ? props.history.go(location as number)
        : props.history.push(location as string, state),
      setLoading: (status: string | null) => this.setState({ loading: status }),
    };

    this.state = {
      accounts: [],
      completeScan: null,
      loading: null,
    }
  }

  componentDidMount() {
    this.setState({
      accounts: this.props.core.getAccounts(),
    });
    this.props.core.onAccountChange((accounts: string[]) => this.setState({ accounts }));
  }

  scanQrCode() {
    return new Promise<string>((resolve, reject) => {
      const completeScan = (result: string | null) => {
        this.setState({ completeScan: null });
        if (result) {
          resolve(result);
        } else {
          reject(new Error('User canceled'));
        }
      };
      this.setState({ completeScan });
    });
  }

  send({ asset, ether, value, to, from, message, id }: SendParams) {
    const _from = from || this.state.accounts[0];
    const _ether = (ether && ether.length > 0) || value ? ether : '0';
    this.props.history.push('/confirm', { asset, ether: _ether, value, to, from: _from, message, id });
  }

  render() {
    const { core, pluginData, children, burnerComponents } = this.props;
    const { accounts, completeScan, loading } = this.state;
    return (
      <Provider value={{
        actions: this.actions,
        accounts,
        assets: core.getAssets(),
        burnerComponents,
        completeScan,
        defaultAccount: accounts.length > 0 ? accounts[0] : ZERO_ADDR,
        pluginData,
        loading,
      }}>
        {accounts.length > 0 && children}
      </Provider>
    )
  }
}

export default withRouter(BurnerProvider);

export function withBurner<P>(WrappedComponent: ComponentType<P>): ComponentType<Diff<P, BurnerContext>> {
  return function(props) {
    return (
      <Consumer>
        {(burnerContext: BurnerContext) => <WrappedComponent {...burnerContext} {...props as P} />}
      </Consumer>
    )
  }
}
