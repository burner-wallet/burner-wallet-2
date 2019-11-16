import React from 'react';
import { PluginPageContext } from '@burner-wallet/types';

interface MatchParams {
  address: string;
  amount: string;
  message: string;
}


const RedirectToSend: React.FC<PluginPageContext<MatchParams>> = ({ match, actions, assets }) => {
  actions.send({
    to: match.params.address,
    ether: match.params.amount,
    message: match.params.message,
    asset: assets[0].id,
  });
  return null;
};

export default RedirectToSend;
