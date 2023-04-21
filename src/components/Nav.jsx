import { Link } from 'react-router-dom';
import React from "react";
import '../styles/Nav.css';

export default function Nav() {
  return (
    <nav className="nav">
      <div className="navLogo">
        <i className="fa-solid fa-a"></i>
      </div>
      <ul className="listItems">
        <li>
          <Link to="/admin">
          <i className="fa-solid fa-chart-column"></i>
          </Link>
        </li>
        <li>
          <Link to="/">
          <i className="fa-solid fa-user"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

