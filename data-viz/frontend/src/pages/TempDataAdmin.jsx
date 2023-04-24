import { useState, useEffect } from 'react';
// import './App.css';
// import data from "../data/json-file-old.json";  // this file contains step_history column (not sending now bkz it is 100MB!)

// import data from '../../data/json-file-1691.json'
// this file gets ride of the step_history and 
// creates a new prop called errorMsg (when the run_status is "failed")

import data from "../../data/json-file-1691.json";


function TempDataRSL() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // const testPull = async () => {
    //   await fetch('https://a05dxdsco2.execute-api.us-east-1.amazonaws.com/test', { method: "GET" })
    //   .then((res) => {
    //     return res.text();
    //   })
    //   .then((data) => {
    //     console.log(JSON.parse(data));
    //     setItems(JSON.parse(data))
    //   });
    // }
    // console.log("data= ", data[0]);
    setItems(data);
    document.title = "Agilitek";
    // testPull();
  }, []);

  // temporary thing to display on console the data
  useEffect(() => {
    console.log("items: ", items);
  }, [items]);

  return (
    <div className=" text-stone-700 text-center">
      <h1 className='font-bold text-3xl text-red-500'>General data as it was a Admin</h1>
      <table className='table-auto border-collapse border border-slate-400'>
        <thead>
          <tr>
            <th className="border border-slate-300">#</th>
            <th className="border border-slate-300">PK</th>
            <th className="border border-slate-300">ID</th>
            <th className="border border-slate-300">Log Details</th>
            <th className="border border-slate-300">CLS</th>
            <th className="border border-slate-300">Run Status</th>
            <th className="border border-slate-300">Run Total Time (min)</th>
            <th className="border border-slate-300">Run Start</th>
            <th className="border border-slate-300">Run End</th>
            <th className="border border-slate-300">Error Msg</th>
          </tr>
        </thead>
        <tbody>
          {items.map((x, index) => (
            <tr key={index + 1}>
                <td className="border border-slate-300 px-2">{index + 1}</td>
                <td className="border border-slate-300 px-2">{x.pk}</td>
                <td className="border border-slate-300 px-2">{x.id}</td>
                <td className="border border-slate-300 px-2">{x.log_details}</td>
                <td className="border border-slate-300 px-2">{x.cls}</td>
                <td className="border border-slate-300 px-2">{x.run_status}</td>
                <td className="border border-slate-300 px-2">{x.runTotalTime}</td>
                <td className="border border-slate-300 px-2">{x.run_start}</td>
                <td className="border border-slate-300 px-2">{x.run_end}</td>
                <td className="border border-slate-300 px-2">{x.errorMsg}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default TempDataRSL;
