import { BurnerPluginContext, Plugin, PluginActionContext } from '@burner-wallet/types';
import OnboardingPage from './ui/OnboardingPage';

const STORAGE_KEY = 'burner-onboarding-complete';

export default class OnboardingPlugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/welcome', OnboardingPage);

    pluginContext.onStartup((ctx: PluginActionContext) => {
      const onboardingComplete = window.localStorage.getItem(STORAGE_KEY) === 'true';

      if (!onboardingComplete) {
        ctx.actions.navigateTo('/welcome');
      }
    });
  }

  complete() {
    window.localStorage.setItem(STORAGE_KEY, 'true');
  }
}
