import React, { Component, Fragment } from 'react';
import { Asset, PluginPageContext } from '@burner-wallet/types';
import styled from 'styled-components';
import Exchange from '../Exchange';
import ExchangeInput from './ExchangeInput';

const FromContainer = styled.div`
  margin-bottom: 16px;
`;

const InputContainer = styled.div`
  margin: 10px;
`;

const Bottom = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const ErrorBar = styled.div`
  margin-bottom: 4px;
`;

const EstimateInfo = styled.div`
  min-height: 18px;
  margin: 8px;
`;

interface ExchangePageState {
  assetA: Asset;
  assetB: Asset;
  amount: string;
  estimate: null | string;
  estimateInfo: null | string;
  isExchanging: boolean;
  error: string | null;
}

export default class ExchangePage extends Component<PluginPageContext<{}, Exchange>, ExchangePageState> {
  private poll: any;

  constructor(props: PluginPageContext<{}, Exchange>) {
    super(props);
    const [firstPair] = this.props.plugin.getPairs();
    this.state = {
      assetA: this.props.plugin.getAsset(firstPair.assetA),
      assetB: this.props.plugin.getAsset(firstPair.assetB),
      amount: '',
      estimate: null,
      estimateInfo: null,
      isExchanging: false,
      error: null,
    };
  }

  getPair(assetA: Asset, assetB: Asset) {
    const [pair] = this.props.plugin.getPairs().filter(_pair =>
      (_pair.assetA === assetA.id && _pair.assetB === assetB.id)
      || (_pair.assetA === assetB.id && _pair.assetB === assetA.id));
    return pair;
  }

  async runExchange() {
    const { assetA, assetB, amount } = this.state;
    const { actions } = this.props;

    const pair = this.getPair(assetA, assetB);
    if (!pair) {
      throw new Error('Invalid pair');
    }

    const exchangeProps = { account: this.props.defaultAccount, ether: amount };

    this.setState({ isExchanging: true, error: null });
    try {
      const loadingMessage = pair.getLoadingMessage()
      actions.setLoading(loadingMessage)
      const response = await (pair.assetA === assetA.id
        ? pair.exchangeAtoB(exchangeProps)
        : pair.exchangeBtoA(exchangeProps));
    } catch (e) {
      this.setState({ error: e.message });
      actions.setLoading(null);
      console.error(e);
    }
    this.setState({ isExchanging: false });
    actions.setLoading(null);
  }

  async getEstimate(assetA: Asset, assetB: Asset, amount: string) {
    const pair = this.getPair(assetA, assetB);
    if (!pair) {
      throw new Error('Invalid pair');
    }

    try {
      const estimate = await (pair.assetA === assetA.id
        ? pair.estimateAtoB({ ether: amount })
        : pair.estimateBtoA({ ether: amount }));
      return estimate;
    } catch (e) {
      console.error(e);
      return {
        estimate: null,
        estimateInfo: null
      };
    }
  }

  getPairOptions(asset: Asset) {
    const pairs = this.props.plugin.getPairs();

    const options = [];
    for (const pair of pairs) {
      if (pair.assetA === asset.id) {
        options.push(this.props.plugin.getAsset(pair.assetB));
      }
      if (pair.assetB === asset.id) {
        options.push(this.props.plugin.getAsset(pair.assetA));
      }
    }
    return options;
  }

  async update({ assetA, assetB, amount }: { assetA?: Asset; assetB?: Asset; amount?: string }) {
    const update: Partial<ExchangePageState> = { estimate: null, estimateInfo: null };
    if (assetA) {
      update.assetA = assetA;

      const options = this.getPairOptions(assetA);
      if (options.length > 0 && options.indexOf(this.state.assetB) === -1) {
        update.assetB = options[0];
      }
    }
    if (assetB) {
      update.assetB = assetB;
    }
    if (amount !== undefined) {
      update.amount = amount;
    }

    this.setState(update as ExchangePageState);
    const start = { ...this.state, ...update };
    if (!start.amount) {
      return;
    }

    const { estimate, estimateInfo } = await this.getEstimate(start.assetA, start.assetB, start.amount);

    // Check if anything has changed while the estimate was fetching.
    if (this.state.assetA === start.assetA
      && this.state.assetB === start.assetB
      && this.state.amount === start.amount) {
        this.setState({
          estimate,
          estimateInfo: estimateInfo || null,
        });
    }
  }

  render() {
    const { burnerComponents } = this.props;
    const { assetA, assetB, amount, estimate, isExchanging, error, estimateInfo } = this.state;
    const { Page, AssetSelector, Button } = burnerComponents;

    const assetBOptions = this.getPairOptions(assetA);
    const assetsProps = { assets: assetBOptions };

    return (
      <Page title="Exchange">
        <InputContainer>
          <ExchangeInput
            input={amount}
            inputUnit={assetA.name}
            onChange={newAmount => this.update({ amount: newAmount })}
            output={estimate ? assetB.getDisplayValue(estimate) : ''}
            outputUnit={assetB.name}
            disabled={isExchanging}
          />
          <EstimateInfo>{estimateInfo}</EstimateInfo>
        </InputContainer>

        <div>
          <FromContainer>
            <div>From:</div>
            <AssetSelector
              selected={assetA}
              onChange={(newAsset: Asset) => this.update({ assetA: newAsset })}
              disabled={isExchanging}
            />
          </FromContainer>

          {assetBOptions.length > 0 ? (
            <Fragment>
              <div>To:</div>
              <AssetSelector
                selected={assetB}
                onChange={(newAsset: Asset) => this.update({ assetB: newAsset })}
                disabled={isExchanging}
                {...assetsProps}
              />
            </Fragment>
          ) : (
            <div>No exchanges available for {assetA.name}</div>
          )}
        </div>

        <Bottom>
          <ErrorBar>{error}</ErrorBar>
          {
            !isExchanging &&
            <Button
              onClick={() => this.runExchange()}
              disabled={isExchanging || assetBOptions.length === 0}
            >
              Exchange
            </Button>
          }
        </Bottom>
      </Page>
    );
  }
}
