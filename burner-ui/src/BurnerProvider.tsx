import React, { Component } from 'react'

interface BurnerProviderProps {
  core: any,
  assets: any[],
  children: React.ReactNode,
}

export interface BurnerContext {
  assets: any[],
  accounts: string[],
}

const { Provider, Consumer } = React.createContext<BurnerContext>({
  assets: [],
  accounts: [],
});

export default class BurnerProvider extends Component<BurnerProviderProps, any> {
  constructor(props: BurnerProviderProps) {
    super(props);
    props.assets.forEach(asset => asset.setCore(props.core));
    this.state = {
      accounts: [],
    }
  }

  componentDidMount() {
    this.setState({
      accounts: this.props.core.getAccounts(),
    });
    this.props.core.onAccountChange((accounts: string[]) => this.setState({ accounts }));
  }

  render() {
    const { assets, children } = this.props;
    const { accounts } = this.state;
    return (
      <Provider value={{assets, accounts}}>
        {children}
      </Provider>
    )
  }
}

export const withBurner = <P extends object>(WrappedComponent: React.ComponentType<P>) => (props: P) => (
  <Consumer>
    {props => <WrappedComponent {...props as P} />}
  </Consumer>
)
