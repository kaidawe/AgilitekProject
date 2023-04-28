import { Timeline } from '@mui/lab';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
// import { customersAPI, integrationsAPI, runsAPI } from '../globals/globals'
import { runsAPI } from '../globals/globals'
import axios from 'axios';
import { useEffect, useState } from 'react';

import CheckCircle from "@mui/icons-material/CheckCircle";
import DangerousRoundedIcon from '@mui/icons-material/DangerousRounded';
import { getDate, getTime } from '../helpers/handlingDtTm.jsx';

export default function CustomizedTimeline(integrationId) {
    const [data, setData] = useState("");

    useEffect(() => {
        const url = runsAPI + `/${encodeURIComponent("INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29")}`; // 528 runs - HOURLY, from 2022-08 to 2023-04

        // const url = runsAPI + `/${encodeURIComponent("INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589")}`; // 66 runs - Schedule - Hourly
        // const url = runsAPI + `/${encodeURIComponent("INTEGRATION#01GHVDYH1YPWQBKDBZPS310KNG")}`; // 1 run - 5PM - 17:00 66 runs

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

        return () => {
            setData("");
        };

    }, []);


    // moved to a /helpers
    // const getDate = dt => {
    //     const formatedDate = new Date(dt);
    //     const dtOptions = {  
    //         year: "numeric", month: "short", day: "numeric"
    //     };  
    //     return formatedDate.toLocaleDateString('en-US', dtOptions);
    // };
        
    // const getTime = tm => {
    //     const formatedTime = new Date(tm);
    //     const tmOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
    //     // time is displaying 24:XX for some runs (ONLY in CHROME)
    //     // so, code below does not help 
    //     // return formatedTime.toTimeString();
    //     return formatedTime.toLocaleTimeString('en-US', tmOptions);        
    // }

    return (
        <Timeline>
            { !data && <h1 className='text-center font-bold text-blue-700 text-2xl mt-8'>Processing...</h1>}
            { data && data.message && 
                <div className='text-center font-bold text-red-500 text-xl mt-8'>
                    <h1><b>Error:</b> {data.message}</h1><h2><b>pk:</b> {data.pk}</h2><h2><b>id:</b> {data.id}</h2>
                </div>
            }

            { data && data.length && data.map((run, index) => (
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
    );
}
