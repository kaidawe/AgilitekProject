
// WE ARE NOT USING THIS PAGE AT THE MOMENT
import { useState, useEffect } from 'react';
import './App.css';
// import data from "../data/json-file-old.json";  // this file contains step_history column (not sending now bkz it is 100MB!)

import data from "../data/json-file.json";  
// this file gets ride of the step_history and 
// creates a new prop called errorMsg (when the run_status is "failed")

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const testPull = async () => {
      await fetch('https://a05dxdsco2.execute-api.us-east-1.amazonaws.com/test', { method: "GET" })
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        console.log(JSON.parse(data));
        setItems(JSON.parse(data))
      });
    }
    
    document.title = "Agilitek";
    // testPull();
  }, []);


  return (
    <div className=" text-stone-700 text-center">
      <table className='table-auto'>
        <thead>
          <tr>
            <th>PK</th>
            <th>ID</th>
            <th>Log Details</th>
            <th>CLS</th>
            <th>Status</th>
            <th>Run Status</th>
            <th>Error Msg</th>
          </tr>
        </thead>
        <tbody>
          {items.map((x, index) => (
            <tr key={index}>
            <td>{index}</td>
            <td>{x.pk}</td>
            <td>{x.id}</td>
            <td>{x.log_details}</td>
            <td>{x.cls}</td>
            <td>{x.run_status}</td>
            <td>{x.errorMsg}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default App;
