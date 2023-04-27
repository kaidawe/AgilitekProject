import React, { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../context/GlobalState'
import axios from 'axios'
import '../styles/TabNavigation.css'
import { Link } from 'react-router-dom'
import { Chart } from 'react-google-charts'

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState(0)
  const { integrations } = useContext(GlobalContext);

  useEffect(() => {
    console.log(integrations);
  }, [activeTab])


  const tabs = [
    {
      id: 0,
      name: 'Success',
      messages: [
        {
          id: 1,
          completed_step: 'Step 1',
          step_ended: '2022-04-01',
          details: 'Details about Step 1 succes',
        },
        {
          id: 2,
          completed_step: 'Step 2',
          step_ended: '2022-04-02',
          details: 'Details about Step 2',
        },
        {
          id: 3,
          completed_step: 'Step 3',
          step_ended: '2022-04-03',
          details: 'Details about Step 3',
        },
      ],
    },
    {
      id: 1,
      name: 'Error',
      messages: [
        {
          id: 1,
          completed_step: 'Data Activation: SFMC (All Fans)',
          step_ended: '2022-04-01',
          details:
            'SFMC - Cavs_DW_Email_Purchases print() takes from 1 to 5 positional arguments but 6 were given',
        },
        {
          id: 2,
          completed_step: 'Blinkfire Pull (Nightly)',
          step_ended: '2022-04-02',
          details:
            'SFMC - Cavs_DW_Email_Purchases invalid literal for int() with base 10: metadata["destination_object_name"]:',
        },
        {
          id: 3,
          completed_step: 'Step 3',
          step_ended: '2022-04-03',
          details: 'Details about Step 3',
        },
      ],
    },
    {
      id: 2,
      name: 'Missed Run',
      messages: [
        {
          id: 1,
          completed_step: 'Step 1',
          step_ended: '2022-04-01',
          details: 'Details about this missed run',
        },
        {
          id: 2,
          completed_step: 'Step 2',
          step_ended: '2022-04-02',
          details: 'Details about this missed run',
        },
        {
          id: 3,
          completed_step: 'Step 3',
          step_ended: '2022-04-03',
          details: 'Details about this missed run',
        },
      ],
    },
  ]

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  const data = [
    ['data', 'count'],
    ['integrations running smoothly', 33],
    ['integrations with recent errors', 7],
    ['integrations that missed Run', 2],
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
    <>
      {' '}
      <div className="flex-div-row">
        <Chart
          chartType="PieChart"
          data={data}
          options={options}
          width={'100%'}
          height={'400px'}
        />
        <div className="tab-navigation">
          <div className="tab-navigation__tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={activeTab === tab.id ? 'active' : ''}
                onClick={() => handleTabClick(tab.id)}
                style={{
                  backgroundColor:
                    tab.name === 'Success'
                      ? '#99CF7F'
                      : tab.name === 'Error'
                      ? '#E47350'
                      : '#4D81B2',
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>
          <div
            className="tab-navigation__content"
            style={{
              borderTop:
                activeTab === 0
                  ? '20px solid #99CF7F'
                  : activeTab === 1
                  ? '20px solid #E47350'
                  : '20px solid #4D81B2',
            }}
          >
            <section className="last-messages">
              <ul>
                {tabs[activeTab].messages.map((message) => (
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
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
