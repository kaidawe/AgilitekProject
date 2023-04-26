import { Link } from "react-router-dom";
import React from "react";
import "../styles/UserDash.css";

import RunSchedule from "../SingleComponents/RunSchedule";
import TabNavigation from "../SingleComponents/TabNavigation";
import Timeline from "../SingleComponents/Timeline";
import Integrations from "../SingleComponents/Integrations";

export const UserDash = () => {  

  return (
  <section className="user-dash-container">
    <div className="tab-navigation-container">
        <TabNavigation />
      </div>
      <br></br>
      <div className="timeline-container">
        <Timeline />
      </div>
      <br></br>
      <div className="integrations-container">
        <Integrations />
      </div>
  </section>

  );

};