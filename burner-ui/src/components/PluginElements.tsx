import React, { Fragment, ComponentType } from 'react';
import { PluginElementData } from '../Plugins';
import { withBurner, BurnerContext } from '../BurnerProvider';
import { Plugin, PluginElementContext } from '../';

interface PluginElementsProps extends BurnerContext {
  position: string,
}

const PluginElements: React.FC<PluginElementsProps> = ({ position, ...props }) => {
  const elements = props.pluginData.elements[position];
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

export default withBurner<PluginElementsProps>(PluginElements);
