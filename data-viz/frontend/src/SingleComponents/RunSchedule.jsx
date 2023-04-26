import '../styles/RunSchedule.css'
import { useState, useEffect } from 'react'
import { customersAPI, integrationsAPI } from '../globals/globals'
import axios from 'axios'

export default function RunSchedule() {
  const [customers, setCustomers] = useState([])
  const [customer, setCustomer] = useState('')
  const [integrations, setIntegrations] = useState([])

  useEffect(() => {
    getCustomers()
  }, [])

  const getCustomers = async () => {
    axios({
      url: customersAPI,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        setCustomers(response.data.customers)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    getIntegrations()
    console.log(integrations)
  }, [customer])

  const getIntegrations = async () => {
    axios({
      url: integrationsAPI + `/${customer}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        setIntegrations(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="box">
      <button onClick={getCustomers}>Get Customers</button>
      <h2>Run Schedule</h2>
      {customers &&
        customers.map((customer, i) => {
          return (
            <button onClick={(e) => setCustomer(customer)} key={i}>
              {customer}
            </button>
          )
        })}
      <p>Current customer: {customer}</p>
      <p>INTEGRATIONS</p>
      {integrations &&
        integrations.map((integration, i) => {
          return (
            <div key={i}>
              <p>Id: {integration.id.S}</p>
              <p>Name: {integration.display_name.S}</p>
              <p>Trigger: {integration.trigger.S}</p>
            </div>
          )
        })}
      <div className="two-columns">
        <div className="comment">
          <h3>27 runs per day</h3>
          <div className="subtitle">5 Integrations</div>
        </div>
        <div className="comment">
          <h3>Last Run: 11:04PM PDT</h3>
          <div className="subtitle">Today</div>
        </div>
        <div className="comment">
          <h3>Daily</h3>
          <div className="subtitle">5 Integrations</div>
        </div>
        <div className="comment">
          <h3>Hourly</h3>
          <div className="subtitle">5 Integrations</div>
        </div>
      </div>
    </div>
  )
}
