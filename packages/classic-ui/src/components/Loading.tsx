import React from 'react';
import injectSheet from 'react-jss';
import { withBurner, BurnerContext } from '@burner-wallet/ui-core';

const style = {
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,

    alignItems: 'center',
    color: 'white',
    justifyContent: 'center',
    fontSize: 32,
  },
};

const Loading: React.FC<BurnerContext & { classes: any }> = ({ classes, loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <div className={classes.overlay}>
      {loading}
    </div>
  );
};

export default injectSheet(style)(withBurner(Loading));
