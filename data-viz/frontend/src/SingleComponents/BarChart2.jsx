import React, { useState } from "react";
import {
  VictoryChart,
  VictoryBar,
  VictoryZoomContainer,
  VictoryBrushContainer,
  VictoryAxis,
} from "victory";

const BarChart2 = ({ integration, runs }) => {

  const chartData = runs.map((run) => {
    const runtime = parseFloat(run.runTotalTime);
    const color = run.run_status === "success" ? "#99CF7F" : "#E47350"; // Green for success, Red for failed runs
    const datetime = new Date(run.run_start);
    return { datetime, runtime, color };
  });

   const [selectedDomain, setSelectedDomain] = useState({});
  const [zoomDomain, setZoomDomain] = useState({});

  const handleZoom = (domain) => {
    const start = new Date(domain.x[0]);
    const end = new Date(domain.x[1]);
    const diffInDays = (end - start) / (1000 * 60 * 60 * 24);
  
    if (diffInDays < 1) {
      // If the difference in days is less than 1, set the x-scale to "time" with a tick format for hours
      setZoomDomain(domain);
      setSelectedDomain({ x: domain.x, y: [0, 1], scale: { x: "time", tickFormat: "%H:%M:%S" } });
    } else {
      // Otherwise, set the x-scale to "time" with a tick format for day/month
      setZoomDomain(domain);
      setSelectedDomain({ x: domain.x, y: [0, 1], scale: { x: "time", tickFormat: "%d-%m" } });
    }
  };
  
  

  const handleBrush = (domain) => {
    setSelectedDomain(domain);
  };



  return (
    <div>
      <h2>
        Scatter Chart of Runs for Integration {integration.integration_name}
      </h2>
      <VictoryChart
        width={1000}
        height={400}
        scale={{ x: "time" }}
        containerComponent={
          <VictoryZoomContainer
            zoomDimension="x"
            onZoomDomainChange={handleZoom}
            zoomDomain={zoomDomain}
            allowZoom={false}
          />
        }
        domain={{
            x: selectedDomain
              ? selectedDomain.x
              : [
                  new Date(runs[0].run_start),
                  new Date(runs[runs.length - 1].run_start),
                ],
            y: [0, 1],
          }}
      >
        <VictoryBar
          data={chartData}
          x="datetime"
          y="runtime"
          style={{ data: { fill: ({ datum }) => datum.color } }}
        />
        <VictoryAxis
          label="Date/Time"
          tickFormat={(x) => new Date(x).toLocaleString("en-US", { hour: "numeric" })}
          />
        <VictoryAxis dependentAxis label="Runtime" />
      </VictoryChart>

      <VictoryChart
        width={1000}
        height={100}
        scale={{ x: "time" }}
        padding={{ left: 50, right: 50, top: 0, bottom: 30 }}
        containerComponent={
          <VictoryBrushContainer
            brushDimension="x"
            onBrushDomainChange={handleBrush}
            brushDomain={selectedDomain}

          />
        }
      >
        <VictoryAxis
          label="Date/Time"
          tickFormat={(x) => {
            const date = new Date(x);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            return `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}`;
          }}
                    />
        <VictoryBar
          data={chartData}
          x="datetime"
          y="runtime"
          style={{ data: { fill: ({ datum }) => datum.color } }}
        />
      </VictoryChart>
    </div>
  );
};

export default BarChart2;

// import React, { useState } from "react";
// import { VictoryChart, VictoryScatter, VictoryZoomContainer, VictoryBrushContainer, VictoryAxis } from "victory";

// const ScatterChart = ({ integration, runs }) => {
//   const [selectedDomain, setSelectedDomain] = useState({});
//   const [zoomDomain, setZoomDomain] = useState({});

//   const handleZoom = (domain) => {
//     setZoomDomain(domain);
//   };

//   const handleBrush = (domain) => {
//     setSelectedDomain(domain);
//   };

//   const chartData = runs.map((run) => {
//     const runtime = parseFloat(run.runTotalTime);
//     const color = runtime > 0.5 ? "red" : "green"; // Red for runtime > 0.5 and green for runtime <= 0.5
//     const datetime = new Date(run.run_start);
//     return { x: datetime, y: runtime, fill: color };
//   });

//   return (
//     <div>
//       <h2>Scatter Chart of Runs for Integration {integration.integration_name}</h2>
//       <VictoryChart
//         width={800}
//         height={400}
//         containerComponent={<VictoryZoomContainer zoomDimension="x" zoomDomain={zoomDomain} onZoomDomainChange={handleZoom} />}
//       >
//         <VictoryScatter data={chartData} />
//       </VictoryChart>
//       <VictoryChart
//         width={800}
//         height={100}
//         containerComponent={<VictoryBrushContainer brushDimension="x" brushDomain={selectedDomain} onBrushDomainChange={handleBrush} />}
//       >
//         <VictoryAxis tickFormat={(x) => new Date(x).toLocaleDateString()} />
//         <VictoryScatter data={chartData} />
//       </VictoryChart>
//     </div>
//   );
// };

// export default ScatterChart;

// import React, { useState, useEffect } from "react";
// import { Chart } from "react-google-charts";

// // import BarChart from './BarChart';

// import { customersAPI, integrationsAPI, runsAPI } from "../globals/globals";
// import axios from "axios";

// const ScatterChart = ({integration,runs}) => {

//   const chartData = runs.map((run) => {
//     const runtime = parseFloat(run.runTotalTime);
//     const color = run.run_status === "success" ? "#99CF7F" : "#E47350"; // Green for success, Red for failed runs
//     const datetime = new Date(run.run_start);
//     return [datetime, runtime, color];
//   });
//   const handlePointHover = (e, chart) => {
//     const point = chart.getSelection()[0];
//     if (point) {
//       const [datetime, runtime, color, status] = chartData[point.row];
//       const dateStr = datetime.toLocaleString();
//       const statusStr = status === 'success' ? 'Successful' : 'Failed';
//       const tooltip = `<div><b>${integration.integration_name} Run Details</b></div>
//         <div>Date/Time: ${dateStr}</div>
//         <div>Status: ${statusStr}</div>
//         <div>Runtime: ${runtime.toFixed(2)}s</div>`;
//       const tooltipDiv = document.createElement('div');
//       tooltipDiv.innerHTML = tooltip;
//       tooltipDiv.style.backgroundColor = color;
//       tooltipDiv.style.padding = '10px';
//       tooltipDiv.style.color = 'white';
//       tooltipDiv.style.fontSize = '12px';
//       chart.tooltip.setDOMContent(tooltipDiv);
//       chart.tooltip.show(e.clientX, e.clientY);
//     } else {
//       chart.tooltip.hide();
//     }
//   };

//   const options = {
//     title: `Scatter Chart of Runs for Integration ${integration.integration_name}`,
//     hAxis: {
//       title: "Date/Time",
//     },
//     vAxis: {
//       title: "Runtime",
//       minValue: 0,
//       maxValue: 1,
//     },
//     legend: {
//       position: "top",
//       textStyle: {
//         color: "#333",
//         fontSize: 12,
//       },
//     },
//     chartArea: {
//       width: "80%",
//       height: "80%",
//     },
//     tooltip: {
//       isHtml: true,
//     },
//     // explorer: {
//     //   actions: ["dragToZoom", "rightClickToReset"],
//     // },
//     // point: {
//     //   events: {
//     //     mouseOver: handlePointHover,
//     //   },
//     // },
//     // backgroundColor: "rgb(215, 215, 215)", // set background color

//   };

//   return (
//     <div style={{ width: "100%", overflowX: "scroll" }}>
//     <h2>Scatter Chart of Runs for Integration {integration.integration_name}</h2>
//     <Chart
//       chartType="ScatterChart"
//       width="2000px" // set a fixed width for the chart
//       height="400px"
//       data={[["Datetime", "Runtime", { role: "style" }], ...chartData]}
//       options={options}
//     />
//   </div>
//   );
// };

// export default ScatterChart;
