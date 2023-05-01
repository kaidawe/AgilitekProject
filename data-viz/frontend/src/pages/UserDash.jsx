import { Link } from "react-router-dom";
import React from "react";
import "../styles/UserDash.css";

import TabNavigation from "../SingleComponents/TabNavigation";
// import CustomizedTimeline from "../SingleComponents/MuiTimelineTony";
import Integrations from "../SingleComponents/Integrations";

export const UserDash = () => {  

  return (
  <section className="user-dash-container">
    <div className="title-area">
      <h1 className="title">User Dashboard</h1>
    </div>
    <div className="tab-navigation-container">
        <TabNavigation />
      </div>
      <br></br>
      <div className="timeline-container">
        {/* <CustomizedTimeline /> */}
      </div>
      <br></br>
      <div className="integrations-container">
        <Integrations />
      </div>
  </section>

  );

};