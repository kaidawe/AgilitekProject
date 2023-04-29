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
import { useEffect, useState } from 'react';

import CheckCircle from "@mui/icons-material/CheckCircle";
import DangerousRoundedIcon from '@mui/icons-material/DangerousRounded';
import { getDate, getTime } from '../helpers/handlingDtTm.jsx';

// temporary customer definition
const customer = "DUCKS";

// export default function CustomizedTimeline(integrationId) {
export default function CustomizedTimeline() {
    const [integrations, setIntegrations] = useState("");
    const [selectedIntegration, setSelectedIntegration] = useState("0");
    const [data, setData] = useState(""); // it holds runs data

    useEffect(() => {
        const url = integrationsAPI + `/${customer}`;
        axios({
            url,
            method: 'get',
            headers: {
            'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                const firstOption = {id: 0, display_name: "Choose an option"};
                const { data } = response;
                console.log("data::: ", data);
                setIntegrations([firstOption, ...data]);
            })
            .catch((error) => {
                console.log("###ERROR: ", error.message || error);
            });

        // it does the cleanup afterwards
        return () => {
            setData("");
            // setFirstRun(true);
            setIntegrations("");
            setSelectedIntegration("0")
        };
    }, []);


    useEffect(() => {
        console.log("selectedIntegration::: ", selectedIntegration, "firstRun: ");
        setData("");

        if (selectedIntegration == 0) {
            return;
        }



        // const url = runsAPI + `/${encodeURIComponent("INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29")}`; // 528 runs - HOURLY, from 2022-08 to 2023-04

        // const url = runsAPI + `/${encodeURIComponent("INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589")}`; // 66 runs - Schedule - Hourly
        // const url = runsAPI + `/${encodeURIComponent("INTEGRATION#01GHVDYH1YPWQBKDBZPS310KNG")}`; // 1 run - 5PM - 17:00 66 runs
        // const url = runsAPI + `/${encodeURIComponent("INTEGRATION#01GQ3GB4Q8V9BKS3E49PSEGRBG")}`; // 56 runs - Nightly
        const url = runsAPI + `/${encodeURIComponent(selectedIntegration)}`; // 56 runs - Nightly

        // const url = runsAPI + `/${encodeURIComponent(integrationId)}`;
        axios({
            // url: integrationsAPI + `/${encodeURIComponent("INTEGRATION#01GHVDYH1YPWQBKDBZPS310KNG")}`,
            url,
            method: 'get',
            headers: {
            'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                const { data } = response;

                // if there was an error on extracting data (BE)
                if (data.length === 1 && data[0]["error"]) {
                    window.alert(`###ERROR: sorry, something bad happened.\n\nmessage: ${data[0].message}\npk: ${data[0].pk}\nid: ${data[0].id}`);
                    throw(data[0]);
                }

                console.log("response: ", data);
                setData(data);
            })
            .catch((err) => {
                console.log("###ERROR: ", err);
                setData({
                    message: err.message || err,
                    pk: err.pk || "",
                    id: err.id || ""
                });
            })
    }, [selectedIntegration]);


    const [filter, setFilter] = useState(0); // default filter to all integrations

    {/*handle filter by week onclick  */}
    const handleFilterWeek = (event) => {
        setFilter(Number(event.target.value));
    };

    {/*handle filter by integration onclick  */}
    const handleIntegrationChange = (event) => {
        setSelectedIntegration(event.target.value);
    };


    return (
        <>
            { !integrations && <h1 className='text-center font-bold text-blue-700 text-2xl pt-8'>Processing Integrations...</h1>}
            { integrations && integrations.message && 
                <div className='text-center font-bold text-red-500 text-xl mt-8'>
                    <h1><b>Error:</b> {data.message}</h1><h2><b>pk:</b> {data.pk}</h2><h2><b>id:</b> {data.id}</h2>
                </div>
            }

            { integrations && !integrations.message &&
                <div className="box">
                    <div className="flex justify-center gap-10 py-4">
                        {/*filter by integration  */}
                        <div>
                            <label htmlFor="integration-filter" className="font-bold">Filter by integration:</label>
                            <select
                                id="integration-filter"
                                value={selectedIntegration}
                                onChange={handleIntegrationChange}
                                className="w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                {/* { integrationOptions.map((option) => ( */}
                                { integrations.map(option => (
                                    <option key={option.id} value={option.id}>
                                        {option.display_name}
                                    </option>
                            ))}
                            </select>
                        </div>

                        {/*filter by weeks  */}
                        <div>
                            <label htmlFor="date-filter" className="font-bold">Filter by weeks:</label>
                            <select
                                id="date-filter"
                                value={filter}
                                onChange={handleFilterWeek}
                                className="w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value={0}>All runs</option>
                                <option value={1}>One week</option>
                                <option value={2}>Two weeks</option>
                                <option value={3}>Three weeks</option>
                            </select>
                        </div>
                    </div>
                </div>
            }

            { selectedIntegration !== "0" &&
                <Timeline>
                    { !data && <h1 className='text-center font-bold text-blue-700 text-2xl mt-8'>Processing Runs...</h1>}
                    { data && data.message && 
                        <div className='text-center font-bold text-red-500 text-xl mt-8'>
                            <h1><b>Error:</b> {data.message}</h1><h2><b>pk:</b> {data.pk}</h2><h2><b>id:</b> {data.id}</h2>
                        </div>
                    }
                    { data && data.length === 0 &&
                        <div className='text-center font-bold text-green-500 text-xl mt-8'>
                            <h1><b>No data to be displayed for the current selection</b></h1>
                        </div>
                    }

                    { data && data.length > 0 && data.map((run, index) => (
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
                                { run.errorMsg &&
                                    <Typography>{run.errorMsg}</Typography>
                                }
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            }
        </>
    );
}
