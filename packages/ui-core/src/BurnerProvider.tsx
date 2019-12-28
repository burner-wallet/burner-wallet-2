import React, { Component, ComponentType, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import BurnerCore from '@burner-wallet/core';
import {
  Diff, BurnerComponents, BurnerContext, BurnerPluginData, SendData, Actions, HistoryEventCallback
} from '@burner-wallet/types';
import { DEFAULT_PLUGIN_DATA } from './Plugins';

const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

interface BurnerProviderProps extends RouteComponentProps {
  core: BurnerCore;
  pluginData: BurnerPluginData;
  children: React.ReactNode;
  burnerComponents: BurnerComponents;
}

interface BurnerProviderState {
  accounts: string[];
  completeScan: ((result: string | null) => any) | null;
  loading: string | null;
}

export type BurnerContext = BurnerContext;

const unavailable = () => { throw new Error('Unavailable') };
export const context = React.createContext<BurnerContext>({
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
  // depricated
  burnerComponents: {} as BurnerComponents,
  BurnerComponents: {} as BurnerComponents,
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
        const pk = PK_REGEX.exec(result)![1];
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

  send({ asset, ether, value, to, from, message, id }: SendData) {
    const _from = from || this.state.accounts[0];
    const _ether = (ether && ether.length > 0) || value ? ether : '0';
    this.props.history.push('/confirm', { asset, ether: _ether, value, to, from: _from, message, id });
  }

  render() {
    const { core, pluginData, children, burnerComponents } = this.props;
    const { accounts, completeScan, loading } = this.state;
    const { Provider } = context;
    return (
      <Provider value={{
        actions: this.actions,
        accounts,
        assets: core.getAssets(),
        burnerComponents,
        BurnerComponents: burnerComponents,
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
  const { Consumer } = context;
  return function BurnerHLC(props) {
    return (
      <Consumer>
        {(burnerContext: BurnerContext) => <WrappedComponent {...burnerContext} {...props as P} />}
      </Consumer>
    )
  }
}

export function useBurner() {
  return useContext(context);
}
