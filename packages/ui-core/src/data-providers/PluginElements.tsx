import React, { Fragment } from 'react';
import { PluginElementsProps, PluginElementData } from '@burner-wallet/types';
import { useBurner } from '../BurnerProvider';

type ModifiedPluginElementsProps = Pick<PluginElementsProps, 'position'>;

const PluginElements: React.FC<ModifiedPluginElementsProps> = ({ position, ...props }) => {
  const { pluginData } = useBurner();

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

export default PluginElements;
