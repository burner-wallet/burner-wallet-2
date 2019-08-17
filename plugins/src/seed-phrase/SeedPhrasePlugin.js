import { BurnerPluginContext, Plugin } from '@burner-wallet/ui';
import SeedPhraseInput from './ui/SeedPhraseInput';

export default class LinksPlugin implements Plugin {
  constructor() {
    this._pluginContext = null;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    this._pluginContext = pluginContext;

    pluginContext.addElement('advanced', SeedPhraseInput);
  }

  get pluginContext() {
    if (!this._pluginContext) {
      throw new Error('Exchange not initialized');
    }
    return this._pluginContext;
  }
}
