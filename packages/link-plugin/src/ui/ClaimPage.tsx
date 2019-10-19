import React, { Component, Fragment } from 'react';
import { Asset } from '@burner-wallet/assets';
import { PluginPageContext } from '@burner-wallet/types';
import LinkPlugin from '../LinkPlugin';

interface ClaimPageState {
  status: 'waiting' | 'claiming' | 'complete' | 'error' | 'claimed';
  amount: string,
}

export default class ClaimPage extends Component<PluginPageContext, ClaimPageState> {
  private plugin: LinkPlugin;
  private _isMounted: boolean;

  constructor(props: PluginPageContext) {
    super(props);
    this.plugin = props.plugin as LinkPlugin;
    this._isMounted = true;
    this.state = {
      status: 'waiting',
      amount: '',
    };
  }

  componentDidMount() {
    this.tryToClaim();
  }

  componentDidUpdate(oldProps: PluginPageContext) {
    if (oldProps !== this.props && this.state.status === 'waiting') {
      this.tryToClaim();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async tryToClaim() {
    const { match, accounts, assets } = this.props;
    const { claimId, claimKey } = (match.params as { claimId: string, claimKey: string });

    if (accounts.length === 0) {
      return;
    }
    const account = accounts[0];
    
    this.setState({ status: 'claiming' });
    if (await this.plugin.canClaim(claimId)) {
      const balance = await this.getXDai().getDisplayBalance(account);
      if (+balance < 0.005) {
        console.log('Insuficent funds, claiming using relay');
        const { receipt, amount } = await this.plugin.relayClaim(claimId, claimKey, account);
        this.setState({ status: 'complete', amount });
      } else {
        console.log('Sufficent funds, claiming with normal transaction');
        const { receipt, amount } = await this.plugin.chainClaim(claimId, claimKey, account);
        this.setState({ status: 'complete', amount });
      }
    } else {
      if (await this.plugin.isClaimed(claimId)) {
        this.setState({ status: 'claimed' })
      }
      if (this._isMounted && this.state.status === 'claiming') {
        console.log('Can\'t claim, waiting');
        setTimeout(() => this.tryToClaim(), 1500);
      }
    }
  }

  getXDai() {
    for (const asset of this.props.assets) {
      if (asset.id === 'xdai') {
        return asset;
      }
    }
    throw new Error('Could not find xDai asset');
  }

  render() {
    const { status, amount } = this.state;
    const { burnerComponents, history, assets } = this.props;
    const { Page } = burnerComponents;

    return (
      <Page title="Claim Link">
        {status === 'claiming' && 'Claiming...'}

        {status === 'claimed' && (
          <div>
            <div>This link has already been claimed</div>
            <div>
              <button onClick={() => history.push('/')}>Home</button>
            </div>
          </div>
        )}

        {status === 'complete' && (
          <div>
            <div>Success!</div>
            <div>You have redeemed {this.getXDai().getUSDValue(amount)} from this link</div>
            <button onClick={() => history.push('/')}>Home</button>
            {/* TODO: use Link component ^ */}
          </div>
        )}
      </Page>
    );
  }
}
