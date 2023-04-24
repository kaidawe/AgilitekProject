import { Link } from 'react-router-dom';
import React from "react";
import '../styles/Header.css';

export default function Header() {
  return (
    <nav className="header">
      <ul className="headerItems">
        <li>
          <Link to="/admin">
          <i className="fa-solid fa-square-poll-horizontal"></i><br></br>
            Admin
          </Link>
        </li>
        <li>
          <Link to="/">
          <i className="fa-solid fa-square-poll-horizontal"></i><br></br>
            User
          </Link>
        </li>
      </ul>
    </nav>
  );
}