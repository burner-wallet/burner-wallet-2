import React, { Component, Fragment } from 'react';
import { Asset } from '@burner-wallet/assets';
import { PluginPageContext } from '@burner-wallet/ui';
import LinkPlugin from '../LinkPlugin';

interface SendLinkPageState {
  value: string,
  asset: Asset | null,
  sent: boolean,
}

export default class SendLinkPage extends Component<PluginPageContext, SendLinkPageState> {
  private plugin: LinkPlugin;

  constructor(props: PluginPageContext) {
    super(props);
    this.plugin = props.plugin as LinkPlugin;
    this.state = {
      value: '0',
      asset: null,
      sent: false,
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

    const { claimUrl, receipt } = await this.plugin.send(this.props.accounts[0], asset, value);
    console.log(receipt);
    this.setState({ sent: true, claimUrl });
  }

  form() {
    const { AssetSelector } = this.props.burnerComponents;
    const { value, asset } = this.state;
    const canSend = asset && asset.network === '100' && +value > 0;
    return (
      <Fragment>
        <AssetSelector selected={asset} onChange={newAsset => this.setState({ asset: newAsset })} />
        <div>
          <input value={value} type="num" onChange={e => this.setState({ value: e.target.value })} />
        </div>
        <button disabled={!canSend} onClick={() => this.send()}>Send</button>
      </Fragment>
    );
  }

  success() {
    return (
      <Fragment>
        <div>Sent successfully!</div>
        <div>{this.state.claimUrl}</div>
        <button onClick={() => this.setState({ value: '0', sent: false })}>Send More</button>
      </Fragment>
    );
  }

  render() {
    const { Page } = this.props.burnerComponents;
    return (
      <Page title="Send with Link">
        {this.state.sent ? this.success() : this.form()}
      </Page>
    );
  }
}
