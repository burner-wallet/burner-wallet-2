import React from 'react';
import { withBurner, BurnerContext } from '../BurnerProvider';
const classes = require('./Header.module.css');

interface HeaderProps {
  title?: string,
}

const Header: React.FC<BurnerContext & HeaderProps> = ({ accounts, title }) => (
  <header className={classes.header}>
    <div className={classes.titleContainer}>
      <div className={classes.title}>{title}</div>
      {title !== 'Burner Wallet' && (
        <div className={classes.subtitle}>Powered by Burner Wallet</div>
      )}
    </div>
    <div className={classes.spacer}/>
    <div className={classes.headerAccount}>{accounts.length > 0 && accounts[0].substr(2, 8)}</div>
  </header>
);

Header.defaultProps = {
  title: 'Burner Wallet',
};

export default withBurner<BurnerContext & HeaderProps>(Header);
