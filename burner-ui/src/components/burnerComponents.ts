import { ComponentType } from 'react';
import { PageProps } from './Page';

export default interface BurnerComponents {
  Page: ComponentType<PageProps>,
}

export { default as Page } from './Page';
