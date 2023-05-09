import React, { useState, useContext, useEffect } from "react";
import { Chart } from "react-google-charts";
import BarChart2 from "../SingleComponents/BarChart2";
import ScatterChart from "../SingleComponents/BarChart2";
import { GlobalContext } from "../context/GlobalState";
import { FaDatabase, FaClock, FaRunning, FaPlay } from "react-icons/fa";
import { differenceInDays, isAfter, startOfDay } from "date-fns";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

const IntegrationDetails = ( ) => {
  const { integrationId } = useParams();
  console.log("integraaaaaaaaaaaa",integrationId)

  const [daysFilter, setDaysFilter] = useState(1); // default filter to all integrations
  const [statusFilter, setStatusFilter] = useState('');
  const prop = useContext(GlobalContext);
const [integration,setIntegration]=useState();
const [integrationRuns,setIntegrationRuns]=useState([])
const [filterMsg,setFilterMsg]=useState("");
console.log("byintegration",prop.runsByIntegration);
console.log(integrationId)
  function filterData() {
    setFilterMsg('');

    let runsFiltered=[]
    let filtered=[]
    if (prop.integrations.length > 0) {
      console.log("integrations", prop.integrations);

      const integrationFiltered = prop.integrations.find((int) => int.id === integrationId);
      console.log("integration2", integrationFiltered);
      setIntegration(integrationFiltered);
      
    }
    if (prop.runs.length > 0) {
      console.log("runs", prop.runs);

       runsFiltered = prop.runs.filter((run) => run.pk === integrationId);

      console.log("IntegrationRuns****", runsFiltered);
      setIntegrationRuns(runsFiltered);
      console.log("IntegrationRuns------",integrationRuns);

    }
    filtered =  integrationRuns.filter((run) => {
      // filter by status
      if (statusFilter && run.run_status !== statusFilter) {
        return false;
      }
  
      // filter by number of days
      const today = new Date(2023, 2, 19, 17, 0, 0, 0)
      const runDate = new Date(run.run_start);
      const daysAgo = Math.floor((today - runDate) / (1000 * 60 * 60 * 24));
      if (daysAgo > daysFilter) {
        return false;
      }
  
      return true;
    });
  

    // filter by days
    if (daysFilter) {
   
      console.log("dddddddd=====",daysFilter)

      const today = new Date(2022, 10, 15, 0, 0, 0, 0);
       filtered = runsFiltered.filter((run) => {
        const runDate = new Date(run.run_start);
        console.log("today______",today)

        console.log("runDate______",runDate)

        const daysAgo = differenceInDays(today, runDate);
        console.log("daysAgo=====",daysAgo)
        if (daysAgo > daysFilter) {
          return false;
        }
        return true;
      });
      if(filtered.length>0){
        console.log("IntegrationRunsDayfilteeer------",filtered);

        setIntegrationRuns(filtered);
        console.log("IntegrationRunsDayfilteeer------",integrationRuns);
      }
        else{
          console.log("noooooo------");

          setFilterMsg("No data with the filter selected")
      
        }
      if (statusFilter) {
        console.log("sssssss",statusFilter)
              filtered = filtered.filter((run) => run.run_status === statusFilter);
              console.log("StatusIntegrationRuns****", filtered);
          
               if(filtered.length>0){
                setIntegrationRuns(filtered);
                console.log("IntegrationRuns------",integrationRuns);
              }
                else{
                  setFilterMsg("No data with the filter selected")
        
        
                }
            }
   
    }
   


  }
  useEffect(() => {

    filterData();

  }, [prop, integrationId,statusFilter,daysFilter]);

  
  const totalRuns = integrationRuns.length;
  const totalRunTime = integrationRuns.reduce((total, run) => {
    return total + parseFloat(run.runTotalTime);
  }, 0);

  console.log("totallll", totalRunTime);
  const averageRunTime = (totalRunTime / totalRuns).toFixed(2);

  let failedCount = 0;
  let successCount = 0;
  let in_progress = 0;

  for (let i = 0; i < integrationRuns.length; i++) {
    // if there are no runs in the integration, continue to next iteration
    if (integrationRuns[i].run_status === "success") {
      successCount += 1;
    } else if (integrationRuns[i].run_status === "failed") {
      failedCount += 1;
    }
    else if (integrationRuns[i].run_status === "in progress") {
      in_progress += 1;
    }
  }
  console.log("failed", failedCount);
  console.log("success", successCount);
  console.log("inProgress", in_progress);

  const data = [
    ["data", "count"],
    ["Successful", successCount],
    ["Failed", failedCount],
    ["InProgress", in_progress],

  ];

  const options = {
    title: "Runs STATUS",
    // sliceVisibilityThreshold: 0.2, // 20%
    pieSliceText: "value",
    legend: {
      position: "left",
      // alignment: "center",
      maxLines: 0,
      width:"300px",
      textStyle: {
        fontSize: 12,
      },
      scrollArrows: false,
      pagination: false,
    },
    tooltip: {
      showColorCode: false,
      isHtml: true,
    },
    // pieStartAngle: 180, // Center the pie chart.
    pieSliceTextStyle: {
      fontSize: 20,
      bold: true,
    },
    colors: ["#99CF7F", "#CC3333","#FFEB3B"],
    // backgroundColor: "rgb(215, 215, 215)", // set background color
  };
  function getStatusTextColor(status) {
    if (status === 'failed') {
      return 'text-red-500';
    } else if (status === 'in progress') {
      return 'text-yellow-500';
    } else {
      return 'text-blue-500';
    }
  }
  
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
 { prop.runs && (<>

      {integration &&  integrationRuns &&     
(<>
        <div className="  rounded-lg  m-2">
          {/* <h2 className="text-2xl  mb-2 underline text-gray-800">
      Integration Details
    </h2> */}
          <div className="flex flex-row justify-center  gap-2">
            <div className="flex flex-col  items-start bg-white p-4 rounded-xl shadow-xl">
              <strong className="flex items-center text-gray-800">
                {" "}
                <i class="fa-solid fa-play"></i>Integration Name:{" "}
              </strong>{" "}
              {integration.display_name}
            </div>
            <div className="flex flex-col  items-center bg-white p-4 rounded-xl shadow-xl">
              <strong className="flex items-center text-gray-800">
                <i class="fa-solid fa-database"></i>Source:{" "}
              </strong>{" "}
              {integration.data_source}
            </div>
            <div className="flex flex-col  items-center bg-white p-4 rounded-xl shadow-xl">
              <strong className="flex  items-center text-gray-800">
                {" "}
                <i class="fa-solid fa-database"></i> Destination:{" "}
              </strong>{" "}
              {integration.data_destination}
            </div>
            <div className="flex flex-col  items-center bg-white p-4 rounded-xl shadow-xl">
              <strong className="flex items-center text-gray-800">
                {" "}
                <i class="fa-solid fa-clock"></i>
                Run Trigger:{" "}
              </strong>{" "}
              {integration.trigger}
            </div>
          </div>
        </div>
        <div className="flex items-center  justify-center  gap-10 py-4">
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
                <option value={8}>one week</option>
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
                statusFilter === "in progress"
                  ? "bg-blue-500"
                  : "bg-yellow-500 hover:bg-yellow-600"
              } text-white py-2 px-4 rounded`}
              onClick={() => handleStatusFilter("in progress")}
            >
              In Progress
            </button>
            <button
              className={`${
                statusFilter === "failed"
                  ? "bg-blue-500"
                  : "bg-red-700 hover:bg-red-600"
              } text-white py-2 px-4 rounded`}
              onClick={() => handleStatusFilter("failed")}
            >
              Failed
            </button>
          </div>
        </div>

        <div className="flex  items-center gap-3">
        <div className="flex  items-center bg-white p-4 rounded-xl shadow-xl">
              <strong className="flex items-center text-gray-800">
                {" "}
                <i class="fa-solid fa-gauge"></i>
                Run Time:{" "}
              </strong>{" "}
              {averageRunTime} 
            </div>
            <div className="flex items-center bg-white p-4 rounded-xl shadow-xl">
              <strong className="flex items-center text-gray-800">
                {" "}
                <i class="fa-solid fa-play"></i>
                Runs:{" "}
              </strong>{" "}
              {totalRuns} runs
            </div>
        </div>
      </div>
      {filterMsg && (<h2 className="text-center text-xxl text-red-700 p-2 m-2">{filterMsg} "{statusFilter}" </h2>)}

      <div className="flex flex-col lg:flex-row justify-center  items-center mb-[10px] p-2 bg-white rounded-xl shadow-xl">
        <Chart
          chartType="PieChart"
          data={data}
          options={options}
          width={"400px"}
          height={"300px"}
        />

        <BarChart2 integration={integration} runs={integrationRuns} />
      </div>
     

      {/* listing all the integration of rsl customer  */}

      <div
        style={{ height: "700px", overflowY: "scroll" }}
        className="flex overflow-auto relative justify-center "
      >
        <table className="table-fixed text-center border-2 border-b divide-y divide-gray-200">
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
            {integrationRuns.map((run) => (
              <tr className="odd:bg-gray-100">
                <td className={`px-6 py-3 overflow-hidden text-sm underline ${getStatusTextColor(run.run_status)}`}>
  <Link to={`/rundetails/${encodeURIComponent(run.id)}`}>
    {run.id}
  </Link>
</td>

                <td className="px-6 py-3  overflow-hidden text-sm text-gray-500">
                  {new Date(run.run_start).toLocaleString()}
                </td>
                <td className="px-6 py-3 overflow-hidden text-sm text-gray-500">
                  {" "}
                  {run.run_end ? new Date(run.run_end).toLocaleString() : ""}
                </td>

                <td className="px-6 py-3  overflow-hidden text-sm text-gray-500">
                  {run.run_status === "success" && (
                    <i className="fas fa-check text-green-500"></i>
                  )}
                  {run.run_status === "in progress" && (
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
            ))}
          </tbody>
        </table>
      
      </div>
      </>
              )}</>
 )}
    </div>
  );
};

export default IntegrationDetails;
