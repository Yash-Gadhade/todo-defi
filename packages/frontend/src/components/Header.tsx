import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC<{}> = () => {
  return (
    <nav className="navbar">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          PYMWYMIs
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/join">Join Campaign</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
