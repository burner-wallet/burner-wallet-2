import { ReactNode } from 'react';
import { BurnerPluginContext, Plugin, PluginActionContext } from '@burner-wallet/types';
import OnboardingPage from './ui/OnboardingPage';

const STORAGE_KEY = 'burner-onboarding-complete';

const isTouchDevice = () => {
  const prefixes = ['', '-webkit-', '-moz-', '-o-', '-ms-', ''];
  const mq = (query: string) => window.matchMedia(query).matches;

  if (
    'ontouchstart' in window ||
    // @ts-ignore
    (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true;
  }
  return mq(['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(''));
};

interface OnboardingPluginOptions {
  alwaysShowSkip?: boolean;
  showArrowButtons?: boolean;
  mobileOnly?: boolean;
}

export default class OnboardingPlugin implements Plugin {
  public slides: ReactNode[];
  public alwaysShowSkip: boolean;
  public showArrowButtons: boolean;
  public mobileOnly: boolean;

  constructor(slides: ReactNode[], {
    alwaysShowSkip = false,
    showArrowButtons = true,
    mobileOnly = false,
  }: OnboardingPluginOptions = {}) {
    this.slides = slides;

    this.alwaysShowSkip = alwaysShowSkip;
    this.showArrowButtons = showArrowButtons;
    this.mobileOnly = mobileOnly;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.addPage('/welcome', OnboardingPage);

    pluginContext.onStartup((ctx: PluginActionContext) => {
      if (this.mobileOnly && !isTouchDevice()) {
        return;
      }

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
