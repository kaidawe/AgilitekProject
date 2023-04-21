import { Link } from 'react-router-dom';
import React from "react";
import '../styles/Nav.css';

export default function Nav() {
  return (
    <nav class="nav">
      <div class="navLogo">
        <i class="fa-solid fa-a"></i>
      </div>
      <ul class="listItems">
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

