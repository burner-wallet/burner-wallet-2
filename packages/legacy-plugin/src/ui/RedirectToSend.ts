import React from 'react';
import { PluginPageContext } from '@burner-wallet/ui-core';
import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  address: string;
  amount: string;
  message: string;
}

type RedirectType = PluginPageContext & RouteComponentProps<MatchParams>;

const RedirectToSend: React.FC<RedirectType> = ({ match, actions, assets }) => {
  actions.send({
    to: match.params.address,
    ether: match.params.amount,
    message: match.params.message,
    asset: assets[0].id,
  });
  return null;
};

export default RedirectToSend as React.FC<PluginPageContext>;
