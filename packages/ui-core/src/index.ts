import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BurnerContext } from './BurnerProvider';
import { BurnerPluginContext } from './Plugins';
import BurnerUIComponents from './BurnerUIComponents';
import { DataProviders } from './data-providers';
import BurnerUICore from './BurnerUICore';

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type Diff<T, K> = Omit<T, keyof K>;

export type BurnerUICore = BurnerUICore;
export type BurnerContext = BurnerContext;
export type BurnerPluginContext = BurnerPluginContext;

export type BurnerUIComponents = BurnerUIComponents;
export type BurnerComponents = BurnerUIComponents & DataProviders;

export interface Plugin {
  initializePlugin(context: BurnerPluginContext): void;
}

export interface BasePluginContext {
  plugin: Plugin;
}

export type PluginPageContext = RouteComponentProps & BasePluginContext & BurnerContext;
export type PluginElementContext = BasePluginContext & BurnerContext;

export type PluginPage = ComponentType<PluginPageContext>;
export type PluginElement = ComponentType<PluginElementContext>;

export interface Account {
  name?: string,
  address: string,
  picture?: string,
}

export interface Page {
  path: string;
  component: ComponentType<any>;
}

export default BurnerUICore;
export { withBurner } from './BurnerProvider';
export { default as DataProviders } from './data-providers';
