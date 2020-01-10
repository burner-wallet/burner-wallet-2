import React, { Fragment } from 'react';
import { PluginButtonData, PluginButtonsProps } from '@burner-wallet/types';
import { useBurner } from '../BurnerProvider';

type ModifiedPluginButtonsProps = Pick<PluginButtonsProps, 'position' | 'component'>;

const PluginButtons: React.FC<ModifiedPluginButtonsProps> = ({
  position, component, children, ...props
}) => {
  const { pluginData, BurnerComponents } = useBurner();

  const elements = pluginData.buttons[position];
  if (!elements || elements.length === 0) {
    return null;
  }

  const Component = component || BurnerComponents.Button;

  return (
    <Fragment>
      {children}

      {elements.map(({ title, path, options }: PluginButtonData, i: number) => (
        <Component key={path || i} title={title} to={path} {...options} {...props} />
      ))}
    </Fragment>
  );
};

export default PluginButtons;
