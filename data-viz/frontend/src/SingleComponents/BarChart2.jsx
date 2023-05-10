import React, { useState } from "react";
import {
  VictoryChart,
  VictoryBar,
  VictoryZoomContainer,
  VictoryBrushContainer,
  VictoryAxis,
  VictoryTooltip
} from "victory";

const BarChart2 = ({ integration, runs ,daysFilter}) => {
  const maxRuntime = Math.max(...runs.map((r) => parseFloat(r.runTotalTime))); // Find the maximum runtime
  const yMax = Math.ceil(maxRuntime);
  const chartData = runs.map((run) => {
    const runtime = parseFloat(run.runTotalTime);

    // const percentage = runtime / maxRuntime; // 
    let color =''; 
    if(run.run_status === "success") 
         {color= "#99CF7F" }
    else if(run.run_status === "failed") 
    {color="#CC3333"}
    else {
    color ="#FFEB3B"}
    const datetime = new Date(run.run_start);
    return { datetime, runtime, color, run };
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
      setSelectedDomain({ x: domain.x, y: [0, yMax], scale: { x: "time", tickFormat: "%H:%M:%S" } });
    } else {
      // Otherwise, set the x-scale to "time" with a tick format for day/month
      setZoomDomain(domain);
      setSelectedDomain({ x: domain.x, y: [0, yMax], scale: { x: "time", tickFormat: "%d-%m" } });
    }
  };
  
  

  const handleBrush = (domain) => {
    setSelectedDomain(domain);
  };

  const filter = () => {
    if (daysFilter === 1) {
      return '24 hours';
    } else if (daysFilter === 3) {
      return daysFilter + ' days';
    }
    else {
      return 'week'
    }
  };
  


  return (
    <div>

      {integration && runs &&(
        <>
      <h2>
     last {filter()}      </h2>
      <VictoryChart
        width={1500}
        height={600}
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
            y: [0, yMax],
          }}
      >
      <VictoryBar
labels={({ datum }) => {
  let label = `RunID: ${datum.run.id} Runtime: ${datum.run.runTotalTime}`;
  if (datum.run.run_status === "failed") {
    label += `\nError Message: ${datum.run.errorMsg}`;
  }
  return label;
}}
  labelComponent={
    <VictoryTooltip
    flyoutStyle={{
      stroke: ({ datum }) => datum.run.run_status=== 'failed'
        ? "#CC3333"
        : "#99CF7F"
    }}
    flyoutPadding={{ top: 10, bottom: 10, left: 10, right: 10 }}
    style={{ fontSize: "24px" }}

    />
  }
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
        
                    />
        <VictoryBar
          data={chartData}
          x="datetime"
          y="runtime"
          style={{ data: { fill: ({ datum }) => datum.color } }}
        />
      </VictoryChart>
      </>
      )}
    </div>
  );
};

export default BarChart2;
