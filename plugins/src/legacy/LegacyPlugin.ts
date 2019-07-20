import { BurnerPluginContext, Plugin } from '@burner-wallet/ui';
import NewPKPage from './ui/NewPKPage';

export default class LinksPlugin implements Plugin {
  private _pluginContext: BurnerPluginContext | null;

  constructor() {
    this._pluginContext = null;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    this._pluginContext = pluginContext;

    pluginContext.addPage('/pk', NewPKPage);
  }

  get pluginContext() {
    if (!this._pluginContext) {
      throw new Error('Exchange not initialized');
    }
    return this._pluginContext;
  }
}
