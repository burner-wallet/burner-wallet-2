import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import MetamaskButton from './MetamaskButton';

export default class MetamaskPlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addElement('home-middle', MetamaskButton);
  }
}
