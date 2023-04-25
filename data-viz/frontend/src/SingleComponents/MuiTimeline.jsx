import * as React from 'react';

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
    clientName: "Client A",
    message: "Success",
    startTime: "2023-04-23 1AM",
    endTime: "2023-04-23 12PM",
    runId: "133",
  },
];


export default function CustomizedTimeline() {
  return (
    
    <Timeline position="alternate">

      {logs.map((log, index) => (
      <>

      <TimelineItem>
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
      <TimelineItem>
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
      <TimelineItem>
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
      <TimelineItem>
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

    </Timeline>
  );
}