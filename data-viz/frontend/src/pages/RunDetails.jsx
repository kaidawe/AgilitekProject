import React, { useState, useEffect, useContext } from "react";
import "../styles/RunDetails.css";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { getDateTime } from "../helpers/handlingDtTm.jsx";
import { useParams } from "react-router-dom";
// import { oneRunAPI } from "../globals/globals";
// import axios from "axios";

const RunDetails = () => {
  const { runId } = useParams();
  const [run, setRun] = useState({});
  const [stepHistory, setStepHistory] = useState("");
  const [integration, setIntegration] = useState({});

  const prop = useContext(GlobalContext);

  useEffect(() => {
    if (prop.runs.length > 0) {
      const run = prop.runs.find((run) => run.id === runId);
      setRun(run || {});
      console.log("runnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", run);
    }

    if (prop.integrations && prop.integrations.length > 0) {
      const integration2 = prop.integrations.find(
        (integration) => integration.id === run.pk
      );

      setIntegration(integration2 || {});

      console.log("innnnnnttttttttttt", integration2);
    }
  }, [prop]);

  //   useEffect(() => {
  //     if (run) {
  //       if (prop.integrations && prop.integrations.length > 0 && run) {
  //         const integration2 = prop.integrations.find(
  //           (integration) => integration.id === run.pk
  //         );

  //         setIntegration(integration2 || {});

  //         console.log("innnnnnttttttttttt", integration2);
  //       }
  //     }
  //   }, [run]);

  //   useEffect(() => {
  //     const url = oneRunAPI;
  //     const getOneRun = async () => {
  //       try {
  //         const { data } = await axios({
  //           url,
  //           params: {
  //             integrationId: encodeURIComponent(integration.id),
  //             runId: encodeURIComponent(run.id),
  //           },
  //           method: "get",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         });

  //         console.log("step_history from the run::: ", data);
  //         setStepHistory(data.step_history);
  //         return data;
  //       } catch (error) {
  //         const errorMessage =
  //           error.message || error || "Problem getting customers";
  //         console.log(`###ERROR: ${errorMessage}`);
  //         return { message: errorMessage };
  //       }
  //     };

  //     console.log("integration", integration);
  //     if (Object.keys(integration).length > 0 && Object.keys(run).length > 0)
  //       getOneRun();
  //   }, [integration, run]);

  return (
    <>
      <Link to="/timeline">
        <button className="back-button">Back To Timeline</button>
      </Link>
      {(Object.keys(run).length > 0 && (
        <>
          <div className="run-container">
            <div className="title-container">
              <h1>{run.id}</h1>
              {/* <h2 className={run.errorMsg ? "failedTitle" : "successTitle"}>
                {run.errorMsg ? "Failed" : "Success"}
              </h2> */}
            </div>
            <div className="details-container">
              <div className="left-column">
                <p>Start: {getDateTime(run.run_start)}</p>
                <p>End: {getDateTime(run.run_end)}</p>
                <p>Duration: {run.runTotalTime}</p>
                <br></br>
                <p>Description: {integration.short_description}</p>
                <p>{integration.trigger}</p>
              </div>
              <div className="right-column">
                <p>{run.pk}</p>
                <p>Destination: {integration.data_destination} </p>
                <p>Source: {integration.original_data_source}</p>
              </div>
            </div>
            <div className="message-container">
              {/* <p>
                {run.errorMsg
                  ? run.errorMsg
                  : stepHistory || "Step history is empty"}
              </p> */}
            </div>
          </div>
        </>
      )) || ( // if theres no run show this message
        <div className="run-container">
          <div className="title-container">
            <h1> No Details to show </h1>
          </div>
        </div>
      )}
    </>
  );
};

export default RunDetails;
