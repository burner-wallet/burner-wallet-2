import React, { Component, Fragment } from 'react';
import { Asset } from '@burner-wallet/assets';
import { PluginPageContext } from '@burner-wallet/types';
import LinkPlugin from '../LinkPlugin';

interface SendLinkPageState {
  value: string,
  asset: Asset | null,
  status: string,
  claimUrl: string,
}

export default class SendLinkPage extends Component<PluginPageContext, SendLinkPageState> {
  private plugin: LinkPlugin;

  constructor(props: PluginPageContext) {
    super(props);
    this.plugin = props.plugin as LinkPlugin;
    this.state = {
      value: '0',
      asset: null,
      status: 'waiting',
      claimUrl: '',
    };
  }

  async send() {
    const { asset, value } = this.state;
    if (!asset) {
      throw new Error('No Asset selected');
    }
    if (asset.network !== '100') {
      throw new Error(`Can not send link on network ${asset.network}`);
    }

    this.setState({ status: 'sending' })
    const { claimUrl, receipt } = await this.plugin.send(this.props.accounts[0], asset, value);
    console.log(receipt);
    this.setState({ status: 'sent', claimUrl });
  }

  form() {
    const { AssetSelector } = this.props.burnerComponents;
    const { value, asset, status } = this.state;
    const canSend = asset && asset.network === '100' && +value > 0;
    return (
      <Fragment>
        <AssetSelector
          selected={asset}
          onChange={(newAsset: Asset) => this.setState({ asset: newAsset })}
          network="100"
        />
        <div>
          <input
            value={value}
            type="num"
            disabled={status === 'sending'}
            onChange={e => this.setState({ value: e.target.value })}
          />
        </div>
        <button disabled={!canSend || status === 'sending'} onClick={() => this.send()}>Send</button>
      </Fragment>
    );
  }

  success() {
    return (
      <Fragment>
        <div>Sent successfully!</div>
        <div>
          <input value={this.state.claimUrl} />
        </div>
        <button onClick={() => this.setState({ value: '0', status: 'waiting' })}>Send More</button>
      </Fragment>
    );
  }

  render() {
    const { Page } = this.props.burnerComponents;
    return (
      <Page title="Send with Link">
        {this.state.status === 'sent' ? this.success() : this.form()}
      </Page>
    );
  }
}
