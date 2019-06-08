import React, { Component } from 'react'

interface BurnerProviderProps {
  core: any,
  assets: any[],
  children: React.ReactNode,
}

interface Actions {
  scanQrCode: () => Promise<string>,
}

export interface BurnerContext {
  actions: Actions,
  accounts: string[],
  assets: any[],
  completeScan?: (result?: string) => null
}

const { Provider, Consumer } = React.createContext<BurnerContext>({
  assets: [],
  accounts: [],
  completeScan: null,
});

export default class BurnerProvider extends Component<BurnerProviderProps, any> {
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
    return new Promise((resolve, reject) => {
      const completeScan = result => {
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
    const { assets, children } = this.props;
    const { accounts, completeScan } = this.state;
    return (
      <Provider value={{actions: this.actions, accounts, assets, completeScan}}>
        {children}
      </Provider>
    )
  }
}

export const withBurner = <P extends object>(WrappedComponent: React.ComponentType<P>) => (props: P) => (
  <Consumer>
    {burnerContext => <WrappedComponent {...burnerContext} {...props as P} />}
  </Consumer>
)
