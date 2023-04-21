import { Link } from 'react-router-dom';
import React from "react";

function Nav() {
  return (
    <nav className="flex flex-col items-center h-full bg-gray-800 text-white">
      <div className="flex items-center justify-center w-full h-20">
        <img src="/logo.svg" alt="Logo" className="h-8" />
      </div>
      <ul className="flex flex-col items-center justify-center flex-grow">
        <li className="my-4">
          <Link
            to="/admin"
            className="text-lg font-medium hover:text-gray-300"
          >
            Admin Dashboard
          </Link>
        </li>
        <li className="my-4">
          <Link
            to="/"
            className="text-lg font-medium hover:text-gray-300"
          >
            User Dashboard
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
