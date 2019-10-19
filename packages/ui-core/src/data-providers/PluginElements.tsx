import React, { Fragment, ComponentType } from 'react';
import { Plugin, PluginElementContext, PluginElementsProps, PluginElementData } from '@burner-wallet/types';
import { withBurner, BurnerContext } from '../BurnerProvider';


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
