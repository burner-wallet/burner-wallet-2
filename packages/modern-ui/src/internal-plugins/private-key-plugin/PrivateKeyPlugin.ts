import PrivateKeyPanel from './PrivateKeyPanel';
import { Plugin, BurnerPluginContext } from '@burner-wallet/types';

export default class PrivateKeyPlugin implements Plugin {
  initializePlugin(context: BurnerPluginContext) {
    context.addElement('advanced', PrivateKeyPanel);
  }
}
