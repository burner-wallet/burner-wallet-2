import { BurnerPluginContext, Plugin } from '@burner-wallet/ui';
import SeedPhraseInput from './SeedPhraseInput';

export default class SeedPhrasePlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addElement('advanced', SeedPhraseInput);
  }
}
