import React, { Fragment, ComponentType } from 'react';
import { PluginElementsProps, PluginElementData } from '@burner-wallet/types';
import { withBurner, BurnerContext } from '../BurnerProvider';

type ModifiedPluginElementsProps = Pick<PluginElementsProps, 'position'>;

const PluginElements: React.FC<ModifiedPluginElementsProps & BurnerContext> = ({ position, pluginData, ...props }) => {
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

export default withBurner(PluginElements) as ComponentType<PluginElementsProps>;
