import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header: React.FC<{}> = () => {
  return (
    <nav className="navbar">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          PYMWYMIs
        </Link>
      </div>
      <div className="flex-none">
        <ul className="flex items-center space-x-4 px-1">
          <li>
            <Link to="/join">
              <button className="btn btn-primary">Join Campaign</button>
            </Link>
          </li>
          <li>
            <ConnectButton />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
