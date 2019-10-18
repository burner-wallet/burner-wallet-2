import AccountBalance from './AccountBalance';
import AccountKeys from './AccountKeys';
import Assets from './Assets';
import History from './History';
import PluginElements from './PluginElements';
import TransactionDetails from './TransactionDetails';

export interface DataProviders {
  AccountBalance: typeof AccountBalance,
  AccountKeys: typeof AccountKeys,
  Assets: typeof Assets,
  History: typeof History,
  PluginElements: typeof PluginElements,
  TransactionDetails: typeof TransactionDetails,
};

export default {
  AccountBalance,
  AccountKeys,
  Assets,
  History,
  PluginElements,
  TransactionDetails,
} as DataProviders;
