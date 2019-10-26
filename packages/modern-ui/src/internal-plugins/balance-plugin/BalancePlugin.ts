import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
import BalanceTab from './BalanceTab';

export default class BalancePlugin implements Plugin {
  initializePlugin(context: BurnerPluginContext) {
    context.addElement('home-tab', BalanceTab, { title: 'Cash' });
  }
}
