import React from 'react';
import './Header.css';
import { withBurner, BurnerContext } from '../BurnerProvider';

const Header: React.FC<BurnerContext> = ({ accounts }) => (
  <header>
    <div className="headerAccount">{accounts.length > 0 && accounts[0].substr(2, 8)}</div>
    Burner Wallet
  </header>
);

export default withBurner<{}>(Header);
