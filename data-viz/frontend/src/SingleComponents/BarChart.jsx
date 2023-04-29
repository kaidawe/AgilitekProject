import React from 'react';
import { Chart } from "react-google-charts";
import  { useState, useEffect } from "react";
import { customersAPI, integrationsAPI, runsAPI } from "../globals/globals";
import axios from "axios";
const BarChart = ({ customer,daysFilter }) => {

    const [integrations, setIntegrations] = useState([]);

    const getIntegrations = async () => {
        let filteredIntegrations = [];
        const result = await axios.get(integrationsAPI + `/${customer}`);
        filteredIntegrations = result.data;
       
      
        for (let i = 0; i < filteredIntegrations.length; i++) {
          const url = runsAPI + `/${encodeURIComponent(filteredIntegrations[i].id.S)}`;
    
          const response = await axios.get(url, {
            params: {
              numDays: daysFilter,
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
          filteredIntegrations[i].runs = response.data;
        }
        setIntegrations(filteredIntegrations);
    }
    useEffect(() => {
        getIntegrations();
        console.log(integrations)
      }, [customer]);
    
      const data = integrations.map((integration) => {
      const successCount = integration.runs.filter((run) => run.run_status === 'success').length;
      const inProgressCount = integration.runs.filter((run) => run.run_status === 'in_progress').length;
      const failedCount = integration.runs.filter((run) => run.run_status === 'failed').length;
    
      return {
        name: integration.integration_name.S,
        successCount,
        inProgressCount,
        failedCount,
      };
    });
    console.log(data)

    const chartData = [
        ["Integration", "Success", "In Progress", "Failed"],
        ...data.map(({ name, successCount, inProgressCount, failedCount }) => [
          name,
          successCount,
          inProgressCount,
          failedCount,
        ]),
      ];
      
      
console.log(data);
let date = new Date(Date.now());
date.setDate(date.getDate() - daysFilter);
date = date.toISOString();
       const options = {
        title: "The number of successful, in-progress, and failed runs for each integration from "+new Date(date).toLocaleString(),

        chartArea: { width: "50%" },
        colors: ["#22C55E","#FFEB3B","#CC3333"],
        hAxis: {
          title: "Runs",
          minValue: 0,
          maxValue:20,
        },
        vAxis: {
          title: "Integrations",
        },
        series: {
            bar: { groupWidth: "50%" }, // set the width of the bars to 50%
        }
      };
      
  

  return (
    <div>
      <h2>{customer} </h2>
      <Chart
      chartType="BarChart"
      width="100%"
      height="400px"
      data={chartData}
      options={options}
    />
    </div>
  );
};

export default BarChart;
