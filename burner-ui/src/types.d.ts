import { ComponentType } from 'react';
import { BurnerContext } from './BurnerProvider';
import { BurnerPluginContext } from './Plugins';
import BurnerUI from './BurnerUI';

export type BurnerUI = BurnerUI;
export type BurnerContext = BurnerContext;
export type BurnerPluginContext = BurnerPluginContext;

export interface Plugin {
  initializePlugin(context: BurnerPluginContext): void;
}

export interface BasePluginPageContext {
  plugin: Plugin;
}

export interface BasePluginElementContext {
  plugin: Plugin;
}

export type PluginPageContext = BasePluginPageContext & BurnerContext;
export type PluginElementContext = BasePluginElementContext & BurnerContext;

export type PluginPage = ComponentType<PluginPageContext>;
export type PluginElement = ComponentType<PluginElementContext>;

export interface Account {
  name?: string,
  address: string,
  picture?: string,
}
