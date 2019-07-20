import React from 'react';
import './Header.css';
import { withBurner, BurnerContext } from '../BurnerProvider';

interface HeaderProps {
  title?: string,
}

const Header: React.FC<BurnerContext & HeaderProps> = ({ accounts, title }) => (
  <header>
    <div className="headerAccount">{accounts.length > 0 && accounts[0].substr(2, 8)}</div>
    {title}
  </header>
);

Header.defaultProps = {
  title: 'Burner Wallet',
};

export default withBurner<BurnerContext & HeaderProps>(Header);
