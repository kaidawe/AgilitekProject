import { Link } from "react-router-dom";
import React from "react";
import "../styles/AdminDash.css";

import TabNavigation from "../SingleComponents/TabNavigation";
import CustomizedTimeline from "../SingleComponents/MuiTimeline";
import Integrations from "../SingleComponents/Integrations";


export const AdminDash = () => {  

  return (
    <section className="user-dash-container">
      <div className="title-area">
        <h1 className="title">Admin Dashboard</h1>
      </div>
      
      <div className="tab-navigation-container">
          <TabNavigation />
        </div>
        <br></br>
        <div className="timeline-container">
          <CustomizedTimeline />
        </div>
        <br></br>
        <div className="integrations-container">
          <Integrations />
        </div>
    </section>
  
    );

};