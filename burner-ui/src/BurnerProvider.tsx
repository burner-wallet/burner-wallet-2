import React, { Component, ComponentType } from 'react';
import BurnerComponents from './components/burnerComponents';
import { BurnerPluginData, DEFAULT_PLUGIN_DATA } from './Plugins';

interface BurnerProviderProps {
  core: any,
  assets: any[],
  pluginData: BurnerPluginData,
  children: React.ReactNode,
  burnerComponents: BurnerComponents,
}

interface Actions {
  callSigner: (action: string, prop: any) => string,
  canCallSigner: (action: string, prop: any) => boolean,
  scanQrCode: () => Promise<string>,
}

export interface BurnerContext {
  actions: Actions,
  accounts: string[],
  assets: any[],
  burnerComponents: BurnerComponents,
  pluginData: BurnerPluginData,
  completeScan: ((result: string | null) => any) | null,
}

const { Provider, Consumer } = React.createContext<BurnerContext>({
  actions: {
    callSigner: () => { throw new Error('Unavailable') },
    canCallSigner: () => { throw new Error('Unavailable') },
    scanQrCode: () => { throw new Error('Unavailable') },
  },
  assets: [],
  accounts: [],
  pluginData: DEFAULT_PLUGIN_DATA,
  burnerComponents: {} as BurnerComponents,
  completeScan: null,
});

export default class BurnerProvider extends Component<BurnerProviderProps, any> {
  private actions: Actions;

  constructor(props: BurnerProviderProps) {
    super(props);
    props.assets.forEach(asset => asset.setCore(props.core));

    this.actions = {
      scanQrCode: this.scanQrCode.bind(this),
      canCallSigner: props.core.canCallSigner.bind(props.core),
      callSigner: props.core.callSigner.bind(props.core),
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

  render() {
    const { assets, pluginData, children } = this.props;
    const { accounts, completeScan } = this.state;
    return (
      <Provider value={{
        actions: this.actions,
        accounts,
        assets,
        burnerComponents: this.props.burnerComponents,
        completeScan,
        pluginData,
      }}>
        {children}
      </Provider>
    )
  }
}

export type WithBurnerContext<T> = BurnerContext & T;

export function withBurner<P>(WrappedComponent: ComponentType<WithBurnerContext<P>>): ComponentType<P> {
  return function(props) {
    return (
      <Consumer>
        {(burnerContext: BurnerContext) => <WrappedComponent {...burnerContext} {...props as P} />}
      </Consumer>
    )
  }
}
