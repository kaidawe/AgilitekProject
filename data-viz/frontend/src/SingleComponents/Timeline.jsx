import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';

const logs = [
  {
    clientName: "Client A",
    message: "Success",
    startTime: "2023-04-23T10:00:00",
    endTime: "2023-04-23T11:00:00",
    runId: "123",
  },
  {
    clientName: "Client B",
    message: "Error",
    startTime: "2023-04-23T12:00:00",
    endTime: "2023-04-23T12:30:00",
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
    startTime: "2023-04-23T14:00:00",
    runId: "7899",
  },
  {
    clientName: "Client E",
    message: "Error",
    startTime: "2023-04-23T12:00:00",
    endTime: "2023-04-23T12:30:00",
    runId: "455",
    lastMessage: "Failed to connect to server",
  },
  {
    clientName: "Client A",
    message: "Success",
    startTime: "2023-04-23T10:00:00",
    endTime: "2023-04-23T11:00:00",
    runId: "133",
  },
];

const getIconClassName = (message) => {
    switch (message) {
      case 'Error':
        return 'fas fa-times-circle text-red-500';
      case 'Success':
        return 'fas fa-check-circle text-green-500';
      case 'In progress':
        return 'text-yellow-500 ';
      default:
        return '';
    }
  }

  export default function Timeline() {
    return (
      <div style={{ height: '700px', maxWidth: '60%', overflowY: 'scroll' }}>
        <VerticalTimeline>
          {logs.map((log, index) => (
            <VerticalTimelineElement
            key={index}
            className={`vertical-timeline-element--${log.message}`}
            date={<span style={{ paddingLeft: '20px', paddingRight: '20px' }}>{`${log.startTime} - ${log.endTime || 'Present'}`}</span>}
            iconStyle={{ background: getIconClassName(log.message).includes('text-red-500') ? '#D00000' : getIconClassName(log.message).includes('text-green-500') ? '#A1E887' : getIconClassName(log.message).includes('text-yellow-500') ? '#E8E288' : 'rgb(33, 150, 243)', color: '#fff' }}
          >
          
              <h3 className="vertical-timeline-element-title">{log.clientName}</h3>
  
              <p>
              {log.message === "error" ? (
                <>
                  <div className="timeline-content">
                    <span className="timeline-icon error">{log.message}</span>
                    <p>{log.lastMessage}</p>
                    <span className="date">{log.startTime}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="timeline-content">
                    <span className={`timeline-icon ${log.message}`}>{log.message}</span>
                    <p>{log.clientName}</p>
                    <span className="date">{log.startTime}</span>
                  </div>
                </>
              )}
              </p>
              <p>Run ID: {log.runId}</p>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    );
  }