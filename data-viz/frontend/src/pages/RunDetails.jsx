import React, { useState, useEffect } from "react";
import "../styles/RunDetails.css";
import axios from "axios";
import { customersAPI, integrationsAPI, runsAPI } from "../globals/globals";
import { Link, Route, Router } from "react-router-dom";

// const runData = {
//     id: 1234,
//     integrationId: 5678,
//     status: 'success',
//     details: {
//       startTime: '2022-05-01 09:00:00',
//       endTime: '2022-05-01 09:30:00',
//       duration: '00:30:00',
//       steps: [
//         { name: 'Step 1', status: 'success' },
//         { name: 'Step 2', status: 'success' },
//         { name: 'Step 3', status: 'failed', errorMessage: 'Failed to execute' },
//         { name: 'Step 4', status: 'success' },
//         { name: 'Step 5', status: 'success' },
//       ],
//     },
//     errorMessage: null,
//   };

export const RunDetails = ({ Integration, run }) => {
  return (
    <>
      <div className="run-container">
        <div className="title-container">
          <h1>Run #{run.id}</h1>
          <h2 className={run.errmsg ? "failedTitle" : "successTitle"}>
            {run.errmsg ? "Failed" : "Success"}
          </h2>
        </div>
        <div className="details-container">
          <div className="left-column">
            <p>Start: 10 {run.startTime}</p>
            <p>End: 11 {run.endTime}</p>
            <p>Duration: 1 hour {run.duration}</p>
            <p>Steps: {run.steps}</p>
            <p>{run.failed_items}</p>
          </div>
          <div className="right-column">
            <p>IntID: {run.integrationId}</p>
            <p>Destination: Postgres</p>
            <p>Source: Data</p>
          </div>
        </div>
        <div className="message-container">
          <p>{run.errmsg ? run.errmsg : "No errors"}</p>
        </div>
      </div>
      <Link to="/">
        <button className="back-button">Back</button>
      </Link>
    </>
  );
};
