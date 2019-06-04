import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { BurnerContext } from '../../BurnerProvider';
import Page from '../../components/Page';

export default class SendPage extends Component<BurnerContext> {
  constructor(props) {
    super(props);
    this.state = {
      to: '',
      value: '',
      asset: 0,
      sending: false,
      txHash: null,
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
    const { assets, accounts } = this.props;
    try {
      this.setState({ sending: true });
      const receipt = await assets[asset].send({ from: accounts[0], to, ether: value });
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
    const { to, value, asset, sending, txHash } = this.state;
    const { actions, assets } = this.props;

    if (txHash) {
      return (
        <Redirect to={`/receipt/${assets[asset].id}/${txHash}`} />
      )
    }

    const canSend = !sending && to.length == 42 && to;
    return (
      <Page title="Send To Address">
        <div>
          <select value={asset} onChange={e => this.setState({ asset: e.target.value })} disabled={sending}>
            {assets.map((_asset, index) => (
              <option value={index} key={index}>{_asset.name}</option>
            ))}
          </select>
        </div>
        <div>To address:</div>
        <div>
          <input value={to} onChange={e => this.setState({ to: e.target.value })} disabled={sending} />
          <button type="button" onClick={() => this.scanCode()} disabled={sending}>Scan</button>
        </div>

        <div>Send Amount:</div>
        <div>
          <input value={value} type="num" onChange={e => this.setState({ value: e.target.value })} disabled={sending} />
        </div>

        <button type="button" onClick={() => this.send()} disabled={!canSend}>Send</button>
      </Page>
    );
  }
}
