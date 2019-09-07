import React, { Fragment, ComponentType } from 'react';
import { PluginElementData } from '../Plugins';
import { withBurner, BurnerContext } from '../BurnerProvider';
import { Plugin, PluginElementContext } from '../';

export interface PluginElementsProps  {
  position: string,
}

const PluginElements: React.FC<PluginElementsProps & BurnerContext> = ({ position, pluginData, ...props }) => {
  const elements = pluginData.elements[position];
  if (!elements || elements.length === 0) {
    return null;
  }

  return (
    <Fragment>
      {elements.map(({ Component, plugin }: PluginElementData, i: number) => (
        <Component key={i} plugin={plugin} {...props} />
      ))}
    </Fragment>
  );
};

export default withBurner<PluginElementsProps & BurnerContext>(PluginElements);
