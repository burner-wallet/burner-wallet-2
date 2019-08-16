import React, { Component, ComponentType } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { BurnerComponents } from './components/burnerComponents';
import { BurnerPluginData, DEFAULT_PLUGIN_DATA } from './Plugins';
import { Diff } from './';

interface BurnerProviderProps extends RouteComponentProps {
  core: BurnerCore,
  pluginData: BurnerPluginData,
  children: React.ReactNode,
  burnerComponents: BurnerComponents,
}

interface SendParams {
  asset: string,
  ether: string,
  to: string,
  from: string,
}

interface Actions {
  callSigner: (action: string, ...props: any[]) => string,
  canCallSigner: (action: string, ...props: any[]) => boolean,
  scanQrCode: () => Promise<string>,
  send: (params: SendParams) => void,
  navigateTo: (location: string | number, state?: any) => void,
}

export interface BurnerContext {
  actions: Actions,
  accounts: string[],
  assets: Asset[],
  burnerComponents: BurnerComponents,
  pluginData: BurnerPluginData,
  completeScan: ((result: string | null) => any) | null,
}

const unavailable = () => { throw new Error('Unavailable') };
const { Provider, Consumer } = React.createContext<BurnerContext>({
  actions: {
    callSigner: unavailable,
    canCallSigner: unavailable,
    navigateTo: unavailable,
    scanQrCode: unavailable,
    send: unavailable,
  },
  assets: [],
  accounts: [],
  pluginData: DEFAULT_PLUGIN_DATA,
  burnerComponents: {} as BurnerComponents,
  completeScan: null,
});

class BurnerProvider extends Component<BurnerProviderProps, any> {
  private actions: Actions;

  constructor(props: BurnerProviderProps) {
    super(props);

    this.actions = {
      scanQrCode: this.scanQrCode.bind(this),
      canCallSigner: props.core.canCallSigner.bind(props.core),
      callSigner: props.core.callSigner.bind(props.core),
      send: this.send.bind(this),
      navigateTo: (location: string | number, state?: any) =>
        Number.isInteger(location as number)
        ? props.history.go(location as number)
        : props.history.push(location as string, state),
    };

    this.state = {
      accounts: [],
      completeScan: null,
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

  send({ asset, ether, to, from }: SendParams) {
    this.props.history.push('/confirm', { asset, ether, to, from });
  }

  render() {
    const { core, pluginData, children, burnerComponents } = this.props;
    const { accounts, completeScan } = this.state;
    return (
      <Provider value={{
        actions: this.actions,
        accounts,
        assets: core.getAssets(),
        burnerComponents,
        completeScan,
        pluginData,
      }}>
        {children}
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
