import React,{useState} from 'react';
import { Chart } from "react-google-charts";
import BarChart2 from './BarChart2';
import ScatterChart from './BarChart2';

const IntegrationDetails = () => {
  const [daysFilter, setDaysFilter] = useState(60); // default filter to all integrations
  const [statusFilter, setStatusFilter] = useState("");
  const  integration =  {
    short_description: 'Blinkfire API pull containing social media data',
    trigger: 'Nightly @ 12pm EST',
    data_destination: 'Postgres',
    integration_name: 'cavs_blinkfire_pull_nightly',
    cls: 'Integration',
    original_data_source: 'Blinkfire',
    pk: 'CAVALIERS',
    id: 'INTEGRATION#01G8XKXVYSRR5AS6T730QJJXQM',
    display_name: 'Blinkfire Pull (Nightly)',
    data_source: 'Blinkfire',
  };
  const   runs = [    {
    log_details: 'swarm_inbound_connector_sfmc',
    run_status: 'success',
    id: 'RUN#1678863651',
    pk: 'INTEGRATION#01G8XKXVYSRR5AS6T730QJJXQM',
    run_start: '2023-03-27T07:00:51.000000+0000',
    run_end: '2023-03-27T07:01:26.000000+0000',
    runTotalTime: '0.58',
    errorMsg: null,
  },
  {
    log_details: 'Outbound Delivery: SFMC',
    run_status: 'failed',
    id: 'RUN#1678903273',
    pk: 'INTEGRATION#01G8XKXVYSRR5AS6T730QJJXQM',    
     run_start: '2023-03-28T18:01:13.000000+0000',
    run_end: '2023-03-28T18:01:18.000000+0000',
    runTotalTime: '0.08',
    errorMsg: 'errorMessage',
  },
  {
    log_details: 'swarm_inbound_connector_sfmc',
    run_status: 'success',
    id: 'RUN#1678863651',
    pk: 'INTEGRATION#01G8XKXVYSRR5AS6T730QJJXQM',
    run_start: '2023-03-13T07:00:51.000000+0000',
    run_end: '2023-03-13T07:01:26.000000+0000',
    runTotalTime: '0.58',
    errorMsg: null,
  },
  {
    log_details: 'Outbound Delivery: SFMC',
    run_status: 'failed',
    id: 'RUN#1678903273',
    pk: 'INTEGRATION#01G8XKXVYSRR5AS6T730QJJXQM',    
     run_start: '2023-03-14T18:01:13.000000+0000',
    run_end: '2023-03-14T18:01:18.000000+0000',
    runTotalTime: '0.08',
    errorMsg: 'errorMessage',
  },
  {
    log_details: 'Outbound Delivery: SFMC',
    run_status: 'failed',
    id: 'RUN#1678730490',
    pk: 'INTEGRATION#01G8XKXVYSRR5AS6T730QJJXQM',
    run_start: '2023-03-15T18:01:30.000000+0000',
    run_end: '2023-03-15T18:04:11.000000+0000',
    runTotalTime: '2.68',
    errorMsg: 'errorMessage',
  },
  {
    log_details: '1679119216',
    run_status: 'success',
    id: 'RUN#1679119216',
    pk: 'INTEGRATION#01G8XKXVYSRR5AS6T730QJJXQM',
    run_start: '2023-03-18T06:00:16.000000+0000',
    run_end: '2023-03-18T06:01:01.000000+0000',
    runTotalTime: '0.75',
    errorMsg: null,
  },
  {
    log_details: 'Outbound Delivery: SFMC',
    run_status: 'failed',
    id: 'RUN#1678903273',
    pk: 'INTEGRATION#01G8XKXVYSRR5AS6T730QJJXQM',    
     run_start: '2023-03-24T18:01:13.000000+0000',
    run_end: '2023-03-24T18:01:18.000000+0000',
    runTotalTime: '0.08',
    errorMsg: 'errorMessage',
  },
  {
    log_details: 'Outbound Delivery: SFMC',
    run_status: 'failed',
    id: 'RUN#1678730490',
    pk: 'INTEGRATION#01G8XKXVYSRR5AS6T730QJJXQM',
    run_start: '2023-03-25T18:01:30.000000+0000',
    run_end: '2023-03-25T18:04:11.000000+0000',
    runTotalTime: '2.68',
    errorMsg: 'errorMessage',
  },
  {
    log_details: '1679119216',
    run_status: 'success',
    id: 'RUN#1679119216',
    pk: 'INTEGRATION#01G8XKXVYSRR5AS6T730QJJXQM',
    run_start: '2023-03-18T06:00:16.000000+0000',
    run_end: '2023-03-18T06:01:01.000000+0000',
    runTotalTime: '0.75',
    errorMsg: null,
  },
  {
    log_details: '1679032814',
    run_status: 'success',
    id: 'RUN#1679032814',
    pk: 'INTEGRATION#01G8XKXVYSRR5AS6T730QJJXQM',
    run_start: '2023-03-17T06:00:14.000000+0000',
    run_end: '2023-03-17T06:00:52.000000+0000',
    runTotalTime: '0.63',
    errorMsg: null,
  }
    ];  
    const filteredRuns = runs.filter((run) => {
      // filter by status
      if (statusFilter && run.run_status !== statusFilter) {
        return false;
      }
    
      // filter by number of days
      const today = new Date();
      const runDate = new Date(run.run_start);
      const daysAgo = Math.floor((today - runDate) / (1000 * 60 * 60 * 24));
      if (daysAgo > daysFilter) {
        return false;
      }
    
      return true;
    }); 
    const totalRuns = runs.length;
    const totalRunTime = runs.reduce((total, run) => {
      return total + parseFloat(run.runTotalTime);
    }, 0);
    
console.log('totallll',totalRunTime)
    const averageRunTime = (totalRunTime / totalRuns).toFixed(2);
  
    let failedCount=0;
    let successCount=0;
    for (let i = 0; i < runs.length; i++) {
      // if there are no runs in the integration, continue to next iteration
      if (runs[i].run_status === "success") {
        successCount += 1;
      } else if (runs[i].run_status === "failed") {
        failedCount += 1;
      }}
      console.log("failed",failedCount)
      console.log("success",successCount)

  const data = [
    ["data", "count"],
    [
      "Successful Run",
       successCount,
    ],
    [
      "Failed Run",
       failedCount,
    ]
  ];

  const options = {
    title: "Runs STATUS",
    //sliceVisibilityThreshold: 0.2, // 20%
    pieSliceText: "value",
    legend: {
      position: 'bottom',
      padding:'10px',
      width:'200px'
    },

    tooltip: {
      showColorCode: false,
      isHtml: true,

    },
  pieStartAngle: 180, // Center the pie chart.
  pieSliceTextStyle: {
    fontSize: 20,
    bold: true,
  },
    colors: ['#99CF7F', '#E47350'],
    backgroundColor: "rgb(215, 215, 215)", // set background color

  };
  
 
  const handleStatusFilter = (status) => {
    console.log("hadleStatus", status);
    setStatusFilter(status);
    console.log("hadleStatus", statusFilter);
  };
  const handleFilterWeek = (event) => {
    setDaysFilter(Number(event.target.value));
    console.log(daysFilter);
  };
  return (
    <div>
    <div className="flex flex-col lg:flex-row items-center mb-[10px] bg-white p-4 rounded-xl shadow-xl">

    {integration &&
    <div className="bg-gray-200 rounded-lg p-4 m-4">
      <h2 className="text-2xl text-sky-500 mb-2 underline text-gray-800">
 Integration Details</h2>
      <div className="flex flex-col gap-6">
        <div >
          <strong className="text-gray-800">Integration Name: </strong> {integration.integration_name}
        </div>
        <div >

          <strong className="text-gray-800">Data Source: </strong> {integration.data_source}
        </div>
        <div >
          <strong className="text-gray-800">Data Destination: </strong> {integration.data_destination}
        </div>
        <div >
          <strong className="text-gray-800">Run Trigger: </strong> {integration.trigger}
        </div>
        <div >

<strong className="text-gray-800">Average Run Time: </strong>{averageRunTime} seconds
</div>
<div >

<strong className="text-gray-800">Total Runs:  </strong>{totalRuns} 
</div>
      </div>
    </div>
  
  }
    <BarChart2 integration={integration} runs={filteredRuns} />
 
  </div>
    <div className="flex items-center  justify-center  gap-10 py-4">
    {/* <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"200px"}
        height={"200px"}
      /> */}
    <div>
      <div className="flex justify-center  gap-10 py-4">
     
        {/*filter by weeks  */}

        <div>
          <label for="date-filter" className="font-bold">
            Filter by weeks:
          </label>
          <select
            id="date-filter"
            value={daysFilter}
            onChange={handleFilterWeek}
            className="w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={1}>24 hours</option>
            <option value={3}>3 days</option>
            <option value={7}>one week</option>
       
          </select>
        </div>
      </div>
      {/*  filter by status  */}

      <div className="flex justify-center space-x-4 mb-4">
        <button
          className={`${
            statusFilter === ""
              ? "bg-blue-500"
              : "bg-gray-500 hover:bg-gray-600"
          } text-white py-2 px-4 rounded`}
          onClick={() => handleStatusFilter("")}
        >
          All Runs
        </button>
        <button
          className={`${
            statusFilter === "success"
              ? "bg-blue-500"
              : "bg-green-500 hover:bg-green-600"
          } text-white py-2 px-4 rounded`}
          onClick={() => handleStatusFilter("success")}
        >
          Success
        </button>
        <button
          className={`${
            statusFilter === "in_progress"
              ? "bg-blue-500"
              : "bg-yellow-500 hover:bg-yellow-600"
          } text-white py-2 px-4 rounded`}
          onClick={() => handleStatusFilter("in_progress")}
        >
          In Progress
        </button>
        <button
          className={`${
            statusFilter === "failed"
              ? "bg-blue-500"
              : "bg-red-500 hover:bg-red-600"
          } text-white py-2 px-4 rounded`}
          onClick={() => handleStatusFilter("failed")}
        >
          Failed
        </button>
      </div>
    </div>
  
  </div>

{/* listing all the integration of rsl customer  */}
<div 
  style={{ height: "700px", overflowY: "scroll" }}
  className="flex overflow-auto relative justify-center "
>
  
    <table className="table-fixed text-center border-x border-b divide-y divide-gray-200">
      <thead>
        <tr>
       
          <th className="px-6 py-3 text-center text-left text-xs font-medium text-gray-500 uppercase w-auto ">
            ID
          </th>
          <th className="px-6 py-3 text-center text-left text-xs font-medium text-gray-500 uppercase w-auto ">
            Run Start
          </th>
          <th className="px-6 py-3  text-center text-left text-xs font-medium text-gray-500 uppercase w-auto ">
            Run End
          </th>
          <th className="px-6 py-3 text-center text-left text-xs font-medium text-gray-500 uppercase w-auto ">
            Run Status
          </th>
          <th className="px-6 py-3 text-center text-left text-xs font-medium text-gray-500 uppercase w-auto ">
            Duration
          </th>
          <th className="px-6 py-3 text-center text-left text-xs font-medium text-gray-500 uppercase w-auto ">
            Message
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y  divide-gray-200">
        {filteredRuns.map((run) =>
            <tr
              className="odd:bg-gray-100"
            >
            
              <td className="px-6 py-3 overflow-hidden text-sm text-gray-500">
                {run.id}
              </td>
              <td className="px-6 py-3  overflow-hidden text-sm text-gray-500">
                {new Date(run.run_start).toLocaleString()}
              </td>
              <td className="px-6 py-3 overflow-hidden text-sm text-gray-500">
                {" "}
                {run.run_end
                  ? new Date(run.run_end).toLocaleString()
                  : ""}
              </td>

              <td className="px-6 py-3  overflow-hidden text-sm text-gray-500">
                {run.run_status === "success" && (
                  <i className="fas fa-check text-green-500"></i>
                )}
                {run.run_status === "in_progress" && (
                  <i className="fas fa-spinner fa-pulse text-yellow-500"></i>
                )}
                {run.run_status === "failed" && (
                  <i className="fas fa-times text-red-500"></i>
                )}
              </td>
              <td className="px-6 py-3 overflow-hidden text-sm text-gray-500">
                {run.runTotalTime} min
              </td>
              <td
                className={`px-6 py-3 overflow-hidden text-sm ${
                  run.errorMsg ? "bg-red-200" : "text-gray-500"
                }`}
              >
                {run.errorMsg ? run.errorMsg : ""}
              </td>
            </tr>
          
        )}
      </tbody>
    </table>
  
</div>
</div>
  );
};

export default IntegrationDetails;
