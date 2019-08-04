import React, { Component } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Asset } from '@burner-wallet/assets';
import { BurnerContext, withBurner } from '../../BurnerProvider';
import { Account } from '../../';
import AddressInputField from '../../components/AddressInputField';
import AddressInputSearchResults from '../../components/AddressInputSearchResults';
import AssetSelector from '../../components/AssetSelector';
import Button from '../../components/Button';
import Page from '../../components/Page';

interface SendPageState {
  to: string,
  value: string,
  asset: Asset | null,
  sending: boolean,
  txHash: string | null,
  account: Account | null,
  accounts: Account[],
}

class SendPage extends Component<BurnerContext & RouteComponentProps, SendPageState> {
  constructor(props: BurnerContext & RouteComponentProps) {
    super(props);
    this.state = {
      to: props.location.state && props.location.state.address || '',
      value: '',
      asset: null,
      sending: false,
      txHash: null,
      account: null,
      accounts: [],
    };
  }

  componentDidMount() {
    this.getAccounts('');
  }

  async getAccounts(search: string) {
    const { pluginData } = this.props;
    const _accounts = await Promise.all(pluginData.accountSearches.map(searchFn => searchFn(search)));
    const accounts = Array.prototype.concat(..._accounts);
    this.setState({ accounts });
  }

  async scanCode() {
    try {
      const address = await this.props.actions.scanQrCode();
      this.setState({ to: address });
    } catch (e) {}
  }

  send() {
    const { asset, to, value } = this.state;
    const { accounts, actions } = this.props;
    if (!asset) {
      throw new Error('Asset not selected');
    }
    actions.send({ from: accounts[0], to, ether: value, asset: asset.id });
  }

  render() {
    const { to, value, asset, sending, txHash, account, accounts } = this.state;
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
          onChange={(to: string, account: Account | null) => this.setState({ to, account })}
          scan={() => this.scanCode()}
          disabled={sending}
        />
        <AddressInputSearchResults accounts={accounts} onSelect={(account: Account) => this.setState({ account })} />

        <div>Send Amount:</div>
        <div>
          <input value={value} type="num" onChange={e => this.setState({ value: e.target.value })} disabled={sending} />
        </div>

        <Button onClick={() => this.send()} disabled={!canSend}>Send</Button>
      </Page>
    );
  }
}

export default withBurner(SendPage);
