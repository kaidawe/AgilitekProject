import { Link } from "react-router-dom";
import React from "react";

export const AdminDash = () => {  

  return (
    <section className="Admin Dashboard Page">
    <h1>Admin </h1>

    <p>Go to <Link to="/">User Dash</Link> page.</p>
    </section>
  );

};