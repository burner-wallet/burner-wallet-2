import React from 'react';
import injectSheet from 'react-jss';
import { withBurner, BurnerContext } from '../BurnerProvider';

const styles = (theme: any) => ({
  header: {
    display: 'flex',
    color: 'white',
    height: 64,
    alignItems: 'center',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    fontFamily: theme.titleFont,
  },
  subtitle: {
    fontSize: 12,
  },
  spacer: {
    flex: '1 0',
  },
  headerAccount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

interface HeaderProps extends BurnerContext {
  title?: string,
  classes: any,
}

const Header: React.FC<HeaderProps> = ({ accounts, title, classes, actions }) => (
  <header className={classes.header}>
    <div className={classes.titleContainer}>
      <div className={classes.title}>{title}</div>
      {title !== 'Burner Wallet' && (
        <div className={classes.subtitle}>Powered by Burner Wallet</div>
      )}
    </div>
    <div className={classes.spacer}/>
    <div className={classes.headerAccount} onClick={() => actions.navigateTo('/receive')}>
      {accounts.length > 0 && accounts[0].substr(2, 8)}
    </div>
  </header>
);

Header.defaultProps = {
  title: 'Burner Wallet',
};

export default injectSheet(styles)(withBurner(Header));
