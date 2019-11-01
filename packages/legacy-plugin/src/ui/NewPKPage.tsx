import React, { Component } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import base64url from 'base64url';
import { bytesToHex } from '../lib';

const pkRegex = /^0x[0-9a-f]{64}$/i;
const base64Regex = /[a-z0-9_-]{43}/i;

interface NewPKPageState {
  invalid: boolean;
}

export default class NewPKPage extends Component<PluginPageContext, NewPKPageState> {
  private triedToRead: boolean;

  constructor(props: PluginPageContext) {
    super(props);
    this.triedToRead = false;
    this.state = {
      invalid: false,
    };
  }

  componentDidMount() {
    this.tryToReadKey();
  }

  componentDidUpdate(oldProps: PluginPageContext) {
    if (oldProps !== this.props) {
      this.tryToReadKey();
    }
  }

  tryToReadKey() {
    if (this.triedToRead || this.props.accounts.length === 0) {
      return;
    }

    this.triedToRead = true;

    if (window.location.hash.length > 1) {
      const hash = window.location.hash.substr(1);
      if (pkRegex.test(hash)) {
        return this.setPK(hash);
      } else if (base64Regex.test(hash)) {
        const pk = bytesToHex(base64url.toBuffer(hash));
        return this.setPK(pk);
      }
    }
    this.setState({ invalid: true });
  }

  async setPK(pk: string) {
    await this.props.actions.callSigner('writeKey', this.props.accounts[0], pk);
    this.props.history.push('/');
  }

  render() {
    const { burnerComponents } = this.props;
    const { Page } = burnerComponents;

    return (
      <Page title="New Primary Key">
        {this.state.invalid ? 'Invalid URL' : 'Loading...'}
      </Page>
    );
  }
}
