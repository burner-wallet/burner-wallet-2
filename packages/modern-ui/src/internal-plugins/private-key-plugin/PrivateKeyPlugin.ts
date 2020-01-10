import PrivateKeyPanel from './PrivateKeyPanel';
import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
import translations from './translations.json';

export default class PrivateKeyPlugin implements Plugin {
  public id = 'private-key-internal';

  initializePlugin(context: BurnerPluginContext) {
    context.addElement('advanced', PrivateKeyPanel);
    context.addTranslations(translations);
  }
}
