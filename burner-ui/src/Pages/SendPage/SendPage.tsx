import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Asset } from '@burner-wallet/assets';
import { BurnerContext } from '../../BurnerProvider';
import { Account } from '../types';
import AddressInputField from '../../components/AddressInputField';
import AssetSelector from '../../components/AssetSelector';
import Page from '../../components/Page';

interface SendPageState {
  to: string,
  value: string,
  asset: Asset | null,
  sending: boolean,
  txHash: string | null,
  account: Account | null,
}

export default class SendPage extends Component<BurnerContext, SendPageState> {
  constructor(props: BurnerContext) {
    super(props);
    this.state = {
      to: '',
      value: '',
      asset: null,
      sending: false,
      txHash: null,
      account: null,
    };
  }

  async scanCode() {
    try {
      const address = await this.props.actions.scanQrCode();
      this.setState({ to: address });
    } catch (e) {}
  }

  async send() {
    const { asset, to, value } = this.state;
    const { accounts } = this.props;
    if (!asset) {
      throw new Error('Asset not selected');
    }
    try {
      this.setState({ sending: true });
      const receipt = await asset.send({ from: accounts[0], to, ether: value });
      this.setState({
        sending: false,
        txHash: receipt.transactionHash,
      })
    } catch (err) {
      this.setState({ sending: false });
      console.error(err);
    }
  }

  render() {
    const { to, value, asset, sending, txHash, account } = this.state;
    const { actions } = this.props;

    if (txHash && asset) {
      return (
        <Redirect to={`/receipt/${asset.id}/${txHash}`} />
      )
    }

    const canSend = asset !== null && !sending && to.length == 42 && to;
    return (
      <Page title="Send To Address">
        <AssetSelector selected={asset} onChange={newAsset => this.setState({ asset: newAsset })} disabled={sending} />
        <div>To address:</div>
        <AddressInputField
          value={to}
          account={account}
          onChange={(to, account) => this.setState({ to, account })}
          scan={() => this.scanCode()}
          disabled={sending}
        />

        <div>Send Amount:</div>
        <div>
          <input value={value} type="num" onChange={e => this.setState({ value: e.target.value })} disabled={sending} />
        </div>

        <button type="button" onClick={() => this.send()} disabled={!canSend}>Send</button>
      </Page>
    );
  }
}
