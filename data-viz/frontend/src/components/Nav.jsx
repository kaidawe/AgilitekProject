import { Link } from "react-router-dom";
import React from "react";
import "../styles/Nav.css";
import AgilitekLogo from "../img/agilitek-logo-96.png";

const logoStyle = {
  padding: "8px",
};
export default function Nav() {
  return (
    <nav className="nav">
      <div className="navLogo">
        {/* <i className="fa-solid fa-a"></i> */}
        <img
          src={AgilitekLogo}
          style={logoStyle}
          alt="Agilitek"
          title="Agilitek"
        />
      </div>
      <ul className="listItems">
        <li>
          <Link to="/admin">
            <i className="fa-solid fa-chart-column"></i>
          </Link>
        </li>
        <li>
          <Link to="/">
            <i className="fa-solid fa-users"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
