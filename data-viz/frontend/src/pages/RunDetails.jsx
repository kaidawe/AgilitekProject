import React, { useState, useEffect, useContext } from "react";
import "../styles/RunDetails.css";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { getDateTime } from "../helpers/handlingDtTm.jsx";
import { useParams } from "react-router-dom";
import { oneRunAPI } from "../globals/globals";
import axios from "axios";

const RunDetails = () => {
    const {integrations, runs} = useContext(GlobalContext);
    const { runId } = useParams();
    const [run, setRun] = useState({});
    const [stepHistory, setStepHistory] = useState("");
    const [integration, setIntegration] = useState({});


    // it loads data from integration an run
    useEffect(() => {
        if (runs.length > 0) {
            const run2 = runs.find(run => run.id === runId);
            setRun(run2 || {});
            console.log("runnnnnnnnnnnnnnnnnnnnnnnn you got: ", run2);
        }

        if (Object.keys(run).length > 0) {
            const integration2 = integrations.find(integration => integration.id === run.pk);
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
                    }
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
            <Link to="/timeline">
                <button className="back-button">Back To Timeline</button>
            </Link>

            { (stepHistory.length > 0 && (
                <>
                    <div className="run-container">
                    <div className="title-container">
                        <h1>{run.id}</h1>
                        <h2 className={run.run_status === "failed" ? "failedTitle" : "successTitle"}>
                            {run.run_status === "failed" ? "Failed" : "Success"}
                        </h2>
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
                        <div>
                            {run.run_status === "failed"
                                // stepHistory is an array of objects (to be handled)
                                ?
                                    <div>
                                        <p className="text-red-500"> Error message: </p>
                                        <p>
                                            { stepHistory[stepHistory.length - 1].completed_step }
                                        </p>
                                    </div>
                                :   
                                    <p>{stepHistory.length} items in the stepHistory array for the current run ({run.id})</p>
                            }
                        </div>
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
