import React, { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../context/GlobalState'
import axios from 'axios'
// import '../styles/TabNavigation.css'
import { Link } from 'react-router-dom'
import { Chart } from 'react-google-charts'

const LatestRunTemplate = {
    success: {
    name: "Success",
    id: "success",
    runs: [],
    count: 0
  },
  failed: {
    name: "Errors",
    id: "failed",
    runs: [],
    count: 0
  },
  missed: {
    name: "Missed",
    id: "missed",
    runs: [],
    count: 0
  }
}

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState("success");
  const [latestRuns, setLatestRuns] = useState(LatestRunTemplate)
  const { integrations } = useContext(GlobalContext);

  useEffect(() => {
    const getLatestRuns = () => {
      let latestRuns = LatestRunTemplate;

      // grab all the latest runs from integrations
      for (let i = 0; i < integrations.length; i++) {
        // if there are no runs in the integration, continue to next iteration
        if(integrations[i].runs.length === 0) {
          continue;
        } 

        let latestDate = "0";
        let latestRun;

        // grabs the run with the most recent run
        integrations[i].runs.forEach((run) => {
          if(run.run_end > latestDate) {
            latestDate = run.run_end;
            latestRun = run;
          }
        })

        // check if run succeeded or failed, then push to latestRuns object
        // alongside incrementing count for successes/fails
        if(latestRun.run_status === "success") {
          latestRuns.success.runs.push(latestRun);
          latestRuns.success.count += 1;
        } else if ( latestRun.run_status === "failed") {
          latestRuns.failed.runs.push(latestRun);
          latestRuns.failed.count += 1;
        }
      }

      setLatestRuns(latestRuns);
    } 

    getLatestRuns();
    console.log(latestRuns)

  }, [integrations])

  const data = [
    ['data', 'count'],
    ['integrations running smoothly', latestRuns === undefined ? 0 : latestRuns.success.count],
    ['integrations with recent errors', latestRuns === undefined ? 0 : latestRuns.failed.count],
    ['integrations that missed Run', 0],
  ]

  const options = {
    //title: "Popularity of Types of Pizza",
    //sliceVisibilityThreshold: 0.2, // 20%
    pieSliceText: 'value',
    // legend: {
    //   position: 'bottom',
    // },

    tooltip: {
      showColorCode: false,
      isHtml: true,
    },
    pieStartAngle: 180, // Center the pie chart.
    pieSliceTextStyle: {
      fontSize: 20,
      bold: true,
    },
    colors: ['#99CF7F', '#E47350', '#4D81B2'],
  }

  return (
    <div className="flex flex-col lg:flex-row items-center mb-[10px]">
      <div className='mt-[10px] w-[400px]'>
        <Chart
          chartType="PieChart"
          data={data}
          options={options}
          width={'400px'}
          height={'400px'}
        />
      </div>

      <div className="flex flex-col flex-grow lg:w-full ml-[10px] mt-[10px] h-[400px]">
        <div className="flex">
          <button 
            className={`${activeTab === latestRuns.success.id ? 'active' : ''} bg-[#99CF7F] tab-nav-button`}
            onClick={() => {setActiveTab(latestRuns.success.id)}}
          >
            {latestRuns.success.name}
          </button>
          <button 
            className={`${activeTab === latestRuns.failed.id ? 'active' : ''} bg-[#E47350] tab-nav-button`}
            onClick={() => {setActiveTab(latestRuns.failed.id)}}
          >
            {latestRuns.failed.name}
          </button>
          <button 
            className={`${activeTab === latestRuns.missed.id ? 'active' : ''} bg-[#4D81B2] tab-nav-button`}
            onClick={() => {setActiveTab(latestRuns.missed.id)}}
          >
            {latestRuns.missed.name}
          </button>
        </div>

        <div
          className={
            `relative flex-grow p-2 rounded-lg rounded-t-none border-solid border-4 overflow-auto
            ${activeTab === 'success' ? 'border-[#99CF7F]' : activeTab === 'failed' ? 'border-[#E47350]' : 'border-[#4D81B2]'}`
          }
        >
          <section className="last-messages">
            <ul>
              {/* {tabs[activeTab].messages.map((message) => (
                <li key={message.id}>
                  <article>
                    <strong>{message.completed_step}</strong>
                    <h5>
                      {tabs[activeTab].name} at: {message.step_ended}
                    </h5>
                    <p>{message.details}</p>
                  </article>
                  <Link to="/details-view">Jump to this message</Link>
                </li>
              ))} */}
              {latestRuns[activeTab].runs.map((run) => (
                <li className='my-2'>
                  <h1 className='text-xl' >{run.pk.split("#")[1]}</h1>
                  <h3>{run.id}</h3>
                  <h3>{run.log_details}</h3>
                  <h3>{run.run_status}</h3>
                  <h3>{run.runTotalTime}</h3>
                </li>
              ))}
            </ul>
          </section>

        </div>
      </div>
    </div>
  )
}
