import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalState.jsx";

// import { Link } from 'react-router-dom';
import React from "react";
import "../styles/Header.css";

export default function Header() {
  const prop = useContext(GlobalContext);
  const [users, setUsers] = useState("");

  useEffect(() => {
    if (prop.customers.length > 0) {
      const userOptions = [
        { id: 0, name: "Choose a user" },
        { id: 1, name: "Administrator" },
      ];
      const allCustomers = prop.customers.map((customer, index) => ({
        id: index + userOptions.length,
        name: customer,
      }));
      setUsers([...userOptions, ...allCustomers]);
    }
  }, [prop]);

  return <nav className="header"></nav>;
}
