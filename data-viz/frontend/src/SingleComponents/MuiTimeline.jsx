import { Timeline } from '@mui/lab';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import { customersAPI, integrationsAPI, runsAPI } from '../globals/globals.jsx';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';

import CheckCircle from "@mui/icons-material/CheckCircle";
import DangerousRoundedIcon from '@mui/icons-material/DangerousRounded';
import { getDate, getTime } from '../helpers/handlingDtTm.jsx';
import { timeOptions } from '../globals/timeOptions.jsx';
import { GlobalContext } from "../context/GlobalState.jsx";


const defaultTimeSpan = 7; // one week

// export default function CustomizedTimeline(integrationId) {
export default function CustomizedTimeline() {
    const prop = useContext(GlobalContext);
    const [integrations, setIntegrations] = useState("");  // it holds only integrations data
    const [integrationsDropDownOptions, setIntegrationsDropDownOptions] = useState("");  // it holds all dropdown options, including 'choose one integration' & 'All'
    const [selectedIntegration, setSelectedIntegration] = useState("0");
    const [selectedTimeOption, setSelectedTimeOption] = useState(defaultTimeSpan); // default is one week
    const [runs, setRuns] = useState("");
    const [customer, setCustomer] = useState(""); // it mimics as it was a logged user

    useEffect(() => {
        if (prop.customers.length > 0 && prop.loggedUser)
            setCustomer(prop.loggedUser);

        return () => {
            setCustomer("");
        }
    }, [prop]);


    useEffect(() => {
        // for now, Administrator is not being considered
        if (customer === "" || customer === "Administrator" || customer === "Choose a user")
            return;

        const url = integrationsAPI + `/${customer}`;
        axios({
            url,
            method: 'get',
            headers: {
            'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const { data } = response;
// console.log("data----", data)
                setIntegrations(data);
                const firstOption = {id: 0, short_description: "Choose an option"};
                const allIntegrations = data.map(e => e.id);
                
                if (allIntegrations.length > 1) {
                    const allIntegrationsOption = {id: [...allIntegrations], short_description: "All integrations"};
                    setIntegrationsDropDownOptions([firstOption, ...data, allIntegrationsOption]);
                }
                else 
                    setIntegrationsDropDownOptions([firstOption, ...data]);
            })
            .catch(error => {
                console.log("###ERROR: ", error.message || error);
                setIntegrations({message: error.message || error});
            });

        // it does the cleanup afterwards
        return () => {
            setIntegrations("");
            setSelectedIntegration("0");
        };
    }, [customer]);


    useEffect(() => {
        let integrationsToBeQueried = selectedIntegration.split(",");
        if (integrationsToBeQueried.length === 1)
            integrationsToBeQueried = integrationsToBeQueried[0];

        if (selectedIntegration == 0) {
            console.log("NO INTGERATION SELECTED ")
            return;
        }
        setRuns("");
        // const url = runsAPI + `/${encodeURIComponent("INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29")}`; // 528 runs - HOURLY, from 2022-08 to 2023-04
        // const url = runsAPI + `/${encodeURIComponent("INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589")}`; // 66 runs - Schedule - Hourly
        // const url = runsAPI + `/${encodeURIComponent("INTEGRATION#01GHVDYH1YPWQBKDBZPS310KNG")}`; // 1 run - 5PM - 17:00 66 runs
        // const url = runsAPI + `/${encodeURIComponent("INTEGRATION#01GQ3GB4Q8V9BKS3E49PSEGRBG")}`; // 56 runs - Nightly
        
        // const url = runsAPI + `/${encodeURIComponent(selectedIntegration)}`;
        const url = runsAPI;
        
        // const url = runsAPI + `/${encodeURIComponent(integrationId)}`;
        axios({
            // url: integrationsAPI + `/${encodeURIComponent("INTEGRATION#01GHVDYH1YPWQBKDBZPS310KNG")}`,
            url,
            params: {
                integrationId: selectedIntegration,
                days: selectedTimeOption
            },
            method: 'get',
            headers: {
            'Content-Type': 'application/json',
            },
        })
            .then(response => {
                const { data } = response;

                // if there was an error on extracting data (BE)
                if (data.length === 1 && data[0]["error"]) {
                    window.alert(`###ERROR: sorry, something bad happened.\n\nmessage: ${data[0].message}\npk: ${data[0].pk}\nid: ${data[0].id}`);
                    throw(data[0]);
                }

                setRuns(data);
            })
            .catch(err => {
                console.log("###ERROR: ", err);
                setRuns({
                    message: err.message || err,
                    pk: err.pk || "",
                    id: err.id || ""
                });
            });

        // it does the cleanup afterwards
        return () => {
            setRuns("");
            // setIntegrations("");
            // setSelectedIntegration("0")
        };
    }, [selectedIntegration, selectedTimeOption]);

    {/*handle filter by time span onclick  */}
    const handleFilterTime = event => {
        setSelectedTimeOption(Number(event.target.value));
    };

    {/*handle filter by integration onclick  */}
    const handleIntegrationChange = event => {
        setSelectedIntegration(event.target.value);
    };


    return (
        <>
            { prop.customers.length > 0 && customer !== "Administrator" && customer !== "Choose a user" && customer !== "" &&
                <div>
                    { !integrations && <h1 className='text-center font-bold text-blue-700 text-2xl pt-8'>Processing Integrations...</h1>}
                    { integrations && integrations.message && 
                        <div className='text-center font-bold text-red-500 text-xl mt-8'>
                            <h1><b>Error:</b> {integrations.message}</h1>
                        </div>
                    }

                    { integrations && !integrations.message &&
                        <div className="box">
                            <div className="flex justify-center gap-10 py-4">
                                {/*filter by integration  */}
                                <div>
                                    <label htmlFor="integration-filter" className="font-bold mr-2">Filter by integration:</label>
                                    <select
                                        id="integration-filter"
                                        value={selectedIntegration}
                                        onChange={handleIntegrationChange}
                                        className="pl-2 w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        { integrationsDropDownOptions.map((option, i) => {
                                            return (
                                                <option key={i} value={option.id}>
                                                    {/* {option.display_name} */}
                                                    {/* {option.display_name + " - " + option.data_destination} */}
                                                    {option.short_description}
                                                </option>)
                                        })}
                                    </select>
                                </div>

                                {/*filter by time span */}
                                <div>
                                    <label htmlFor="date-filter" className="font-bold mr-2">Filter by Time Span:</label>
                                    <select
                                        id="date-filter"
                                        value={selectedTimeOption}
                                        onChange={handleFilterTime}
                                        className="pl-2 w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        { timeOptions.map((option, index) => (
                                            <option key={index} value={option.days}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    }

                    { selectedIntegration !== "0" &&
                        <Timeline>
                            { !runs && <h1 className='text-center font-bold text-blue-700 text-2xl mt-8'>Processing Runs...</h1>}
                            { runs && runs.message && 
                                <div className='text-center font-bold text-red-500 text-xl mt-8'>
                                    <h1><b>Error:</b> {runs.message}</h1><h2><b>pk:</b> {runs.pk}</h2><h2><b>id:</b> {runs.id}</h2>
                                </div>
                            }
                            { runs && runs.length === 0 &&
                                <div className='text-center font-bold text-green-500 text-xl mt-8'>
                                    <h1><b>No data to be displayed for the current selection</b></h1>
                                </div>
                            }

                            { runs && runs.length > 0 && runs.map((run, index) => (
                                <TimelineItem key={index}>
                                    <TimelineOppositeContent
                                        sx={{ m: 'auto 0' }}
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        <Typography><b>Date: </b> {getDate(run.run_start)}</Typography>
                                        <Typography><b>From: </b> {getTime(run.run_start)} <b>to: </b> {getTime(run.run_end)}</Typography>
                                        <Typography><b>Total Time: </b>{run.runTotalTime} min</Typography>
                                    </TimelineOppositeContent>
                                    
                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot color={run.run_status === "success" ? "success" : "error"}>
                                            { run.run_status === "success"
                                                ? <CheckCircle />
                                                : <DangerousRoundedIcon />
                                            }
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>

                                    <TimelineContent sx={{ py: '12px', px: 2 }} title={`Log details: ${run.log_details}`}>
                                        <Typography variant="h6" component="span"> <b>{index + 1}. {run.run_status.toUpperCase()}</b> </Typography>
                                        <Typography> {run.id} </Typography>
                                        <Typography> {run.pk} </Typography>
                                        { run.errorMsg &&
                                            <Typography>{run.errorMsg}</Typography>
                                        }
                                    </TimelineContent>
                                </TimelineItem>
                            ))}
                        </Timeline>
                    }
                </div>
            }
        </>
    );
}