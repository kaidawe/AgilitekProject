// import * as React from 'react';

import { Timeline } from '@mui/lab';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import Typography from '@mui/material/Typography';
import { customersAPI, integrationsAPI, runsAPI } from '../globals/globals'
import axios from 'axios';
import { useEffect, useState } from 'react';


import rslData from "../../data/01G7FY02XJ145HE2TTJJRAE8BA.json";
import integrationsData from "../../data/json-file-1691.json";


// temp data
const logs = [
  {
    clientName: "Client A",
    message: "Success",
    startTime: "2023-04-23 12PM",
    endTime: "2023-04-23 1PM",
    runId: "123",
  },
  {
    clientName: "Client B",
    message: "Error",
    startTime: "2023-04-23 1PM",
    endTime: "2023-04-23 2PM",
    runId: "456",
    lastMessage: "Failed to connect to server",
  },
  {
    clientName: "Client C",
    message: "In progress",
    startTime: "2023-04-23T14:00:00",
    runId: "789",
  },
  {
    clientName: "Client D",
    message: "In progress",
    startTime: "2023-04-23 8AM",
    runId: "7899",
  },
  {
    clientName: "Client E",
    message: "Error",
    startTime: "2023-04-23 4AM",
    endTime: "2023-04-23 2AM",
    runId: "455",
    lastMessage: "Failed to connect to server",
  },
  {
    clientName: "Client F",
    message: "Success",
    startTime: "2023-04-23 1AM",
    endTime: "2023-04-23 12PM",
    runId: "133",
  },
];


// whoever is sending integrationId to this component, needs to first apply encodeURIComponent
export default function CustomizedTimeline(integrationId) {

  const [filter, setFilter] = useState(0); // default filter to all integrations
  const [selectedIntegration, setSelectedIntegration] = useState('0'); // default filter to all integrations

  let filteredRuns = rslData;
  console.log(filteredRuns);

  // apply integration ID filter
  if (selectedIntegration !== '0') {
    console.log(selectedIntegration);

    filteredRuns = rslData.filter((run) => run.pk === selectedIntegration);
  }

  // apply week filter
  if (filter !== 0) {
    filteredRuns = filteredRuns.filter((run) => {
      const runDate = new Date(run.run_start);
      const today = new Date();
      const filterDate = new Date();
      filterDate.setDate(today.getDate() - filter * 7); // filter by weeks

      return runDate >= filterDate && runDate <= today;
    });
  }

            {/*handle filter by week onclick  */}

  const handleFilterWeek = (event) => {
    setFilter(Number(event.target.value));
  };
            {/*handle filter by integration onclick  */}

  const handleIntegrationChange = (event) => {
    setSelectedIntegration(event.target.value);
  };

  // generate integration ID options
  const integrationOptions = [
    { id: 0, name: "All integrations" },
    ...Array.from(new Set(rslData.map((run) => run.pk))).map((id) => {
      const integration = integrationsData.find((i) => i.id === id);
      return {
        id,
        name: integration ? integration.integration_name : `${id}`,
      };
    }),
  ];


    useEffect(() => {
        // const url = runsAPI + `/${encodeURIComponent("INTEGRATION#01GHVDYH1YPWQBKDBZPS310KNG")}`; // 1 run
        // const url = runsAPI + `/${encodeURIComponent("INTEGRATION#01G9FZ90DC7Y5A032G7RCP6Z29")}`; // 528 runs, from 2022-08 to 2023-04

        const url = runsAPI + `/${encodeURIComponent("INTEGRATION#01GHYNW8ABYVRRV0YCQ1FYT589")}`; // 66 runs
        // const url = runsAPI + `/${encodeURIComponent(integrationId)}`;
        console.log("url::: ", url);
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
                if (data.length === 1 && data[0]["error"])
                    window.alert(`###ERROR: sorry, something bad happened.\n\nmessage: ${data[0].message}\npk: ${data[0].pk}\nid: ${data[0].id}`);

                console.log("response: ", data);
            })
            .catch((err) => {
            console.log("###ERROR: ", err);
        })
    }, []);

    return (
      <><div className="box">
        <div className="flex justify-center gap-10 py-4">
          {/*filter by integration  */}

          <div>
            <label for="integration-filter" className="font-bold">Filter by integration:</label>
            <select
              id="integration-filter"
              value={selectedIntegration}
              onChange={handleIntegrationChange}
              className="w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {integrationOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          {/*filter by weeks  */}

          <div>
            <label for="date-filter" className="font-bold">Filter by weeks:</label>
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

      </div><Timeline position="alternate" style={{ height: '700px', maxWidth: '100%', overflowY: 'scroll' }}>

          {logs.map((log, index) => (
            <>
              <TimelineItem key={"1" + index}>
                <TimelineOppositeContent
                  sx={{ m: 'auto 0' }}
                  align="right"
                  variant="body2"
                  color="text.secondary"
                >
                  {log.startTime}
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot>
                    <FastfoodIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>

                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography variant="h6" component="span">
                    {log.clientName}
                  </Typography>
                  <Typography>{log.message}</Typography>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem key={"2" + index}>
                <TimelineOppositeContent
                  sx={{ m: 'auto 0' }}
                  variant="body2"
                  color="text.secondary"
                >
                  10:00 am
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot color="primary">
                    <LaptopMacIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography variant="h6" component="span">
                    Code
                  </Typography>
                  <Typography>Because it&apos;s awesome!</Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem key={"3" + index}>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot color="primary" variant="outlined">
                    <HotelIcon />
                  </TimelineDot>
                  <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography variant="h6" component="span">
                    Sleep
                  </Typography>
                  <Typography>Because you need rest</Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem key={"4" + index}>
                <TimelineSeparator>
                  <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                  <TimelineDot color="secondary">
                    <RepeatIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography variant="h6" component="span">
                    Repeat
                  </Typography>
                  <Typography>Because this is the life you love!</Typography>
                </TimelineContent>
              </TimelineItem>

            </>
          ))}

        </Timeline></>
    );
}