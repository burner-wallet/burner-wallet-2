import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BurnerContext } from './BurnerProvider';
import { BurnerPluginContext } from './Plugins';
import BurnerUI from './BurnerUI';

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type Diff<T, K> = Omit<T, keyof K>;

export type BurnerUI = BurnerUI;
export type BurnerContext = BurnerContext;
export type BurnerPluginContext = BurnerPluginContext;

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

export default BurnerUI;
