import React from 'react';
import { BurnerPluginContext, Plugin } from '@burner-wallet/ui';
import NewPKPage from './ui/NewPKPage';
import RedirectToSend from './ui/RedirectToSend';

export default class LinksPlugin implements Plugin {
  private _pluginContext: BurnerPluginContext | null;

  constructor() {
    this._pluginContext = null;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    this._pluginContext = pluginContext;

    pluginContext.addPage('/pk', NewPKPage);
    pluginContext.addPage('/:address(0x[0-9a-f]{40});:amount([\d\.]+);:message', RedirectToSend);
    // pluginContext.onQR
  }

  get pluginContext() {
    if (!this._pluginContext) {
      throw new Error('Exchange not initialized');
    }
    return this._pluginContext;
  }
}
