# Burner Wallet Onboarding Plugin

Adds an onboarding carousel when users open a Burner Wallet

## Usage

Install package:

```
yarn add @burner-wallet/onboarding-plugin
```

Add plugin to Burner Wallet

```javascript
import OnboardingPlugin, { SimpleSlide } from '@burner-wallet/onboarding-plugin';
import image1 from './image1.png';
import image2 from './image2.png';

const onboardingPlugin = new OnboardingPlugin([
  (<SimpleSlide title="Title" subtitle="Subtitle" image={image1} />),
  (<SimpleSlide title="Title 2" subtitle="Subtitle 2" image={image2} />),
]);

const BurnerWallet = () =>
  <ModernUI
    core={core}
    plugins={[onboardingPlugin]}
  />
```
