import { BurnerPluginContext, Plugin } from '@burner-wallet/types';
import SeedPhraseInput from './SeedPhraseInput';

export default class SeedPhrasePlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addElement('advanced', SeedPhraseInput);
  }
}
