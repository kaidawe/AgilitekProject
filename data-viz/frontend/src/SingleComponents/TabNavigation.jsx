import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";
// import '../styles/TabNavigation.css'
import { Chart } from "react-google-charts";

const template = {
  integration: "",
  integration_name: "",
  runs: [
    {
      run_id: "",
    },
  ],
};

const LatestRunTemplate = {
  success: {
    name: "Success",
    id: "success",
    runs: [],
    count: 0,
  },
  failed: {
    name: "Errors",
    id: "failed",
    runs: [],
    count: 0,
  },
  missed: {
    name: "Missed",
    id: "missed",
    runs: [],
    count: 0,
  },
};

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState("success");
  const [latestRuns, setLatestRuns] = useState(LatestRunTemplate);
  const { integrations } = useContext(GlobalContext);

  useEffect(() => {
    const getLatestRuns = () => {
      let latestRuns = LatestRunTemplate;

      // grab all the latest runs from integrations
      for (let i = 0; i < integrations.length; i++) {
        // if there are no runs in the integration, continue to next iteration
        if (integrations[i].runs.length === 0) {
          continue;
        }

        let latestDate = "0";
        let latestRun;

        // grabs the run with the most recent run
        integrations[i].runs.forEach((run) => {
          if (run.run_end > latestDate) {
            latestDate = run.run_end;

            // attach integration details to latest run
            run.display_name = integrations[i].display_name;
            run.short_description = integrations[i].short_description;
            latestRun = run;
          }
        });

        // check if run succeeded or failed, then push to latestRuns object
        // alongside incrementing count for successes/fails
        if (latestRun.run_status === "success") {
          latestRuns.success.runs.push(latestRun);
          latestRuns.success.count += 1;
        } else if (latestRun.run_status === "failed") {
          latestRuns.failed.runs.push(latestRun);
          latestRuns.failed.count += 1;
        }
      }

      setLatestRuns(latestRuns);
    };

    getLatestRuns();
    console.log(latestRuns);
  }, [integrations]);

  const data = [
    ["data", "count"],
    [
      "integrations running smoothly",
      latestRuns === undefined ? 0 : latestRuns.success.count,
    ],
    [
      "integrations with recent errors",
      latestRuns === undefined ? 0 : latestRuns.failed.count,
    ],
    ["integrations that missed Run", 0],
  ];

  const options = {
    title: "LATEST INTEGRATION STATUS",
    sliceVisibilityThreshold: 1, // 20%
    pieSliceText: "value",
    legend: {
      position: "bottom",
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
    colors: ["#99CF7F", "#E47350", "#4D81B2"],
  };

  return (
    <div className="flex flex-col lg:flex-row items-center mb-[10px] bg-white p-4 rounded-xl shadow-xl">
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"300px"}
        height={"300px"}
      />

      <div className="flex flex-col flex-grow lg:w-full ml-[10px] h-[400px] relative">
        <div className="flex flex-col relative">
          <div className="flex">
            <button
              className={`${
                activeTab === latestRuns.success.id ? "active" : ""
              } bg-[#99CF7F] tab-nav-button`}
              onClick={() => {
                setActiveTab(latestRuns.success.id);
              }}
            >
              {latestRuns.success.name}
            </button>
            <button
              className={`${
                activeTab === latestRuns.failed.id ? "active" : ""
              } bg-[#E47350] tab-nav-button`}
              onClick={() => {
                setActiveTab(latestRuns.failed.id);
              }}
            >
              {latestRuns.failed.name}
            </button>
            <button
              className={`${
                activeTab === latestRuns.missed.id ? "active" : ""
              } bg-[#4D81B2] tab-nav-button`}
              onClick={() => {
                setActiveTab(latestRuns.missed.id);
              }}
            >
              {latestRuns.missed.name}
            </button>
          </div>

          <div
            className={`w-full h-[30px] px-3 flex items-center ${
              activeTab === "success"
                ? "bg-[#99CF7F]"
                : activeTab === "failed"
                ? "bg-[#E47350]"
                : "bg-[#4D81B2]"
            }`}
          >
            <h1>
              {activeTab === "success"
                ? "These are the latest successful runs"
                : activeTab === "failed"
                ? "These runs recently failed"
                : "These runs missed their trigger"}
            </h1>
          </div>
        </div>

        <div
          className={
            `relative flex-grow px-2 border-solid border-2 border-t-none border-stone-500 overflow-auto`
            // ${activeTab === 'success' ? 'border-t-[#99CF7F] border-t-[30px]' : activeTab === 'failed' ? 'border-t-[#E47350]' : 'border-t-[#4D81B2]'}`
          }
        >
          <section className="">
            <ul>
              {latestRuns[activeTab].runs.map((run) => (
                <li className="my-2 p-2 bg-white rounded-xl border-2 border-stone-400">
                  <h1 className="text-xl font-semibold">{run.display_name}</h1>
                  <div className="mt-2">
                    {activeTab === "failed" ? (
                      <h3 className="text-xl text-red-500">{run.errorMsg}</h3>
                    ) : (
                      <></>
                    )}
                    <h3>{run.short_description}</h3>
                    <h3>{run.runTotalTime}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
