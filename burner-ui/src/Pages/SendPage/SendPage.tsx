import React, { Component, Fragment } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import injectSheet from 'react-jss';
import { Asset } from '@burner-wallet/assets';
import { BurnerContext, withBurner } from '../../BurnerProvider';
import { Account } from '../../';
import AddressInputField from '../../components/AddressInputField';
import AddressInputSearchResults from '../../components/AddressInputSearchResults';
import AssetSelector from '../../components/AssetSelector';
import AmountInput from '../../components/AmountInput';
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

type SendPageProps = BurnerContext & RouteComponentProps & { classes: any };

const styles = {
  messageField: {
    width: '100%',
    padding: 4,
    fontSize: 16,
    background: '#EEEEEE',
    height: 40,
    boxSizing: 'border-box',
    border: 'solid 1px #cccccc',
    borderRadius: 4,
  },
  sendContainer: {
    marginTop: 16,
  },
};

class SendPage extends Component<SendPageProps, SendPageState> {
  constructor(props: BurnerContext & RouteComponentProps) {
    super(props);
    this.state = {
      to: props.location.state && props.location.state.address || '',
      value: '',
      message: '',
      asset: null,
      sending: false,
      txHash: null,
      account: null,
      accounts: [],
    };
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
    const { asset, to, value, message } = this.state;
    const { accounts, actions } = this.props;
    if (!asset) {
      throw new Error('Asset not selected');
    }
    actions.send({
      from: accounts[0],
      to,
      ether: value,
      asset: asset.id,
      message: message.length > 0 ? message : null,
    });
  }

  render() {
    const { to, value, asset, sending, txHash, account, accounts, message } = this.state;
    const { actions, classes } = this.props;

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
          onChange={(to: string, account: Account | null) => {
            this.setState({ to, account });
            if (account) {
              this.setState({ accounts: [] });
            } else {
              this.getAccounts(to);
            }
          }}
          scan={() => this.scanCode()}
          disabled={sending}
        />
        <AddressInputSearchResults
          accounts={accounts}
          onSelect={(account: Account) => this.setState({ account, accounts: [] })}
        />

        <div>Send Amount:</div>
        <AmountInput
          asset={asset}
          value={value}
          onChange={e => this.setState({ value: e.target.value })}
          disabled={sending}
        />

        {asset && asset.supportsMessages() && (
          <Fragment>
            <div>Message:</div>
            <input
              value={message}
              onChange={e => this.setState({ message: e.target.value })}
              className={classes.messageField}
            />
          </Fragment>
        )}

        <div className={classes.sendContainer}>
          <Button onClick={() => this.send()} disabled={!canSend}>Send</Button>
        </div>
      </Page>
    );
  }
}

export default injectSheet(styles)(withBurner(SendPage));
