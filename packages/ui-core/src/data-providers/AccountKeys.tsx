import React, { Component } from 'react';
import { AccountKeysProps } from '@burner-wallet/types';
import { withBurner, BurnerContext } from '../BurnerProvider';

const POLL_INTERVAL = 1000;

class AccountKeys extends Component<BurnerContext & AccountKeysProps, any> {
  constructor(props: BurnerContext & AccountKeysProps) {
    super(props);
    this.state = {
      keys: null,
    };
  }

  componentDidMount() {
    this.updateKeys();
  }

  componentDidUpdate(oldProps: BurnerContext & AccountKeysProps) {
    if (this.props !== oldProps) {
      this.updateKeys();
    }
  }

  updateKeys() {
    const { account, accounts, actions } = this.props;
    if (accounts.indexOf(account) === -1 || !actions.canCallSigner('readKey', account)) {
      this.setState({ keys: null });
      return
    }

    const keys = {
      privateKey: actions.callSigner('readKey', account),
      burnAccount: () => actions.callSigner('burn', account),
    }
    this.setState({ keys })
  }

  render() {
    return this.props.render(this.state.keys);
  }
}

export default withBurner(AccountKeys);
