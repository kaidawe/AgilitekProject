import React, { useState, useEffect, useContext } from "react";
import "../styles/RunDetails.css";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { getDateTime } from "../helpers/handlingDtTm.jsx";
import { useParams } from "react-router-dom";
import { oneRunAPI } from "../globals/globals";
import axios from "axios";

const RunDetails = () => {
  const { integrations, runs } = useContext(GlobalContext);
  const { runId } = useParams();
  const [run, setRun] = useState({});
  const [stepHistory, setStepHistory] = useState("");
  const [integration, setIntegration] = useState({});
  const [isShown, setIsShown] = useState(false);

  function handleButtonClick() {
    setIsShown(!isShown);
  }

  // it loads data from integration an run
  useEffect(() => {
    if (runs.length > 0) {
      const run2 = runs.find((run) => run.id === runId);
      setRun(run2 || {});
      console.log("runnnnnnnnnnnnnnnnnnnnnnnn you got: ", run2);
    }

    if (Object.keys(run).length > 0) {
      const integration2 = integrations.find(
        (integration) => integration.id === run.pk
      );
      setIntegration(integration2 || {});
      console.log("innnnnntttttttttttegration you got: ", integration2);
    }
  }, [integrations, runs, run]);

  // it checks whether the stepHistory is ready
  useEffect(() => {
    if (stepHistory.length > 0) {
      // from here, stepHistory is populated and ready to be consumed
      console.log("stepHistory you got: ", stepHistory);
    }
  }, [stepHistory]);

  // it grabs all step_history for the current run
  useEffect(() => {
    const url = oneRunAPI;
    const getStepHistory = async () => {
      try {
        const { data } = await axios({
          url,
          params: {
            integrationId: encodeURIComponent(integration.id),
            runId: encodeURIComponent(run.id),
          },
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });

        setStepHistory(data);
        return data;
      } catch (error) {
        const errorMessage =
          error.message || error || "Problem getting customers";
        console.log(`###ERROR: ${errorMessage}`);
        return { message: errorMessage };
      }
    };

    // only gets the current run's step_history when there is integration and run
    if (Object.keys(integration).length > 0 && Object.keys(run).length > 0)
      getStepHistory();
  }, [integration, run]);

  return (
    <>
      {(stepHistory.length > 0 && (
        <>
          <div className="run-container">
            <div className="title-container">
              <h1>{run.id}</h1>
              <h2
                className={
                  run.run_status === "failed" ? "failedTitle" : "successTitle"
                }
              >
                {run.run_status === "failed" ? "Failed" : "Success"}
              </h2>
            </div>
            <div className="details-container">
              <div className="left-column">
                <p>
                  <span style={{ fontWeight: "bold" }}>Start:</span>{" "}
                  {getDateTime(run.run_start)}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>End:</span>{" "}
                  {getDateTime(run.run_end)}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Duration:</span>{" "}
                  {run.runTotalTime}
                </p>
                <br></br>
                <p>
                  <span style={{ fontWeight: "bold" }}>Description:</span>{" "}
                  {integration.short_description}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>
                    {integration.trigger}
                  </span>
                </p>
              </div>
              <div className="right-column">
                <Link
                  to={`/integrationDetails/${encodeURIComponent(
                    integration.id
                  )}`}
                >
                  <p>
                    <span
                      style={{
                        fontWeight: "extra-bold",
                        color: "rgb(90, 126, 174)",
                      }}
                    >
                      {run.pk}
                    </span>
                  </p>
                </Link>
                <p>
                  <span style={{ fontWeight: "bold" }}>Destination:</span>{" "}
                  {integration.data_destination}{" "}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Source:</span>{" "}
                  {integration.original_data_source}
                </p>
              </div>
            </div>
            <div className="message-container">
              <div>
                {run.run_status === "failed" ? (
                  <div>
                    <p className="text-red-500">Error message:</p>
                    <p>{stepHistory[stepHistory.length - 1].completed_step}</p>
                  </div>
                ) : (
                  <p>
                    {stepHistory.length} items in the step history list for the
                    current run: {run.id}
                  </p>
                )}
              </div>
              <br></br>

              <span className="button-container">
                <button
                  className="step-history-button"
                  onClick={handleButtonClick}
                >
                  See step history
                </button>
              </span>

              {isShown && (
                <div
                  className="step-history"
                  style={{ overflowY: "scroll", maxHeight: "200px" }}
                >
                  {stepHistory.map((step, index) => (
                    <div key={index}>
                      <p>
                        <strong>Completed step:</strong> {step.completed_step}
                      </p>
                      <p>
                        <strong>Step ended:</strong>{" "}
                        {getDateTime(step.step_ended)}
                      </p>
                      <hr />
                    </div>
                  ))}
                </div>
              )}
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
      <div className="button-container">
        <Link to={`/integrationDetails/${encodeURIComponent(integration.id)}`}>
          <button className="back-button">Back to Integration Details</button>
        </Link>
      </div>
    </>
  );
};

export default RunDetails;
