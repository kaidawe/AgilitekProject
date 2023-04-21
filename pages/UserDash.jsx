import { Link } from "react-router-dom";
import React from "react";

export const UserDash = () => {  

  return (
    <section className="User Dashboard Page">
    <h1>User </h1>

    <p>Go to <Link to="/admin">Admin</Link> page.</p>
    </section>
  );

};