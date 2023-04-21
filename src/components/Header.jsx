import { Link } from 'react-router-dom';
import React from "react";
import '../styles/Header.css';

export default function Header() {
  return (
    <nav class="header">
      <ul class="headerItems">
        <li>
          <Link to="/admin">
          <i class="fa-solid fa-square-poll-horizontal"></i><br></br>
            Admin
          </Link>
        </li>
        <li>
          <Link to="/">
          <i class="fa-solid fa-square-poll-horizontal"></i><br></br>
            User
          </Link>
        </li>
      </ul>
    </nav>
  );
}