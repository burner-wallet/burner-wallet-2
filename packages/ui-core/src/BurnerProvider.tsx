import React, { Component, ComponentType } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import HistoryEvent from '@burner-wallet/core/HistoryEvent';
import { BurnerPluginData, DEFAULT_PLUGIN_DATA } from './Plugins';
import { Diff, BurnerComponents } from './';

const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

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
  openDefaultQRScanner: () => Promise<void>,
  scanQRCode: () => Promise<string>,
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
    openDefaultQRScanner: unavailable,
    scanQRCode: unavailable,
    safeSetPK: unavailable,
    send: unavailable,
    setLoading: unavailable,
    getHistoryEvents: unavailable,
    onHistoryEvent: unavailable,
    removeHistoryEventListener: unavailable,
  },
  assets: [],
  accounts: [],
  defaultAccount: ZERO_ADDR,
  pluginData: DEFAULT_PLUGIN_DATA,
  burnerComponents: {} as BurnerComponents,
  completeScan: null,
  loading: null,
});

const ADDRESS_REGEX = /^(?:0x)?[0-9a-f]{40}$/i;
const PK_REGEX = /^(?:https?:\/\/[-a-z.]+\/pk#)?((?:0x)?[0-9a-f]{64})$/i;

class BurnerProvider extends Component<BurnerProviderProps, BurnerProviderState> {
  private actions: Actions;

  constructor(props: BurnerProviderProps) {
    super(props);

    this.actions = {
      canCallSigner: props.core.canCallSigner.bind(props.core),
      callSigner: props.core.callSigner.bind(props.core),
      openDefaultQRScanner: this.openDefaultQRScanner.bind(this),
      safeSetPK: (newPK: string) => props.history.push('/pk', { newPK }),
      scanQRCode: this.scanQRCode.bind(this),
      send: this.send.bind(this),
      navigateTo: (location: string | number, state?: any) =>
        Number.isInteger(location as number)
        ? props.history.go(location as number)
        : props.history.push(location as string, state),
      setLoading: (status: string | null) => this.setState({ loading: status }),

      getHistoryEvents: (options: any) => props.core.getHistoryEvents(options),
      onHistoryEvent: (cb: HistoryEventCallback) => props.core.onHistoryEvent(cb),
      removeHistoryEventListener: (cb: HistoryEventCallback) =>
        props.core.removeHistoryEventListener(cb),
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

  scanQRCode() {
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

  async openDefaultQRScanner() {
    const { actions } = this;
    try {
      const result = await this.scanQRCode();
      if (this.props.pluginData.tryHandleQR(result, { actions })) {
        return;
      } else if (ADDRESS_REGEX.test(result)) {
        actions.navigateTo('/send', { to: result });
      } else if (PK_REGEX.test(result)) {
        // @ts-ignore
        const pk = PK_REGEX.exec(result)[1];
        actions.safeSetPK(pk);
      } else if (result.indexOf(location.origin) === 0) {
        actions.navigateTo(result.substr(location.origin.length));
      } else {
        console.log(`Unhandled QR code "${result}"`);
      }
    } catch (e) {
      if (e.message !== 'User canceled') {
        console.error(e);
      }
    }
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
