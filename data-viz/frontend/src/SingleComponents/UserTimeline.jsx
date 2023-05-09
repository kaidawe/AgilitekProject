import '../styles/AdminTimeline.css'
import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  VictoryChart,
  VictoryZoomContainer,
  VictoryAxis,
  VictoryBar,
  VictoryBrushContainer,
  VictoryTooltip,
  VictoryLabel,
  Bar,
  Rect,
  Circle,
  Background,
} from 'victory'
import {
  subDays,
  endOfDay,
  subHours,
  startOfDay,
  addDays,
  format,
} from 'date-fns'
import { GlobalContext } from '../context/GlobalState.jsx'
import '../styles/AdminTimeline.css'
import ducks_icon from '../images/ducks_icon.png'
import rsl_icon from '../images/rsl_icon.png'
import oilers_icon from '../images/oilers_icon.png'
import bse_icon from '../images/bse_icon.png'
import wild_icon from '../images/wild_icon.png'
import gulls_icon from '../images/gulls_icon.png'
import swarm_icon from '../images/swarm_icon.png'
import cavaliers_icon from '../images/cavaliers_icon.png'

function UserTimeline() {
  const navigate = useNavigate()
  const context = useContext(GlobalContext)

  // TEMPORARY NOW
  let now = new Date(Date.UTC(2022, 10, 14, 23, 0, 0, 0)) // replace this line with now as UTC
  const tomorrow = addDays(now, 1)
  const endDate = new Date(
    Date.UTC(
      tomorrow.getUTCFullYear(),
      tomorrow.getUTCMonth(),
      tomorrow.getUTCDate(),
      0,
      0,
      0,
      0
    )
  )

  // CONTEXT DATA

  const company = context.loggedUser
  const allIntegrations = context.integrations

  // END OF CONTEXT DATA

  const [selectedDomain, setSelectedDomain] = useState()
  const [zoomDomain, setZoomDomain] = useState()
  const [data, setData] = useState([])
  const [integrations, setIntegrations] = useState([])
  // const [companies, setCompanies] = useState([])
  // const [integrationsByCompany, setIntegrationsByCompany] = useState([])

  // useEffect(() => {
  //   if (context.runs.length > 0) {
  //     constructCompanyObjects()
  //   }
  // }, [context])

  useEffect(() => {
    if (context.runs.length > 0) {
      // set number of integrations
      let integrations = []
      context.runs.forEach((run) => {
        const integration = allIntegrations.filter(
          (integration) => integration.id === run.pk
        )
        integrations.push(integration[0])
      })
      let uniqueIntegrations = [...new Set(integrations)]
      setIntegrations(uniqueIntegrations)

      setData(context.runs)
      dayFilter(7)
    }
  }, [context])

  // const constructCompanyObjects = () => {
  //   let companyObjectArray = []
  //   let allIntegrations = []
  //   let tickCounter = 0
  //   allCompanies.forEach((company) => {
  //     const companyRuns = getCompanyRuns(company)
  //     if (companyRuns.length > 0) {
  //       let companyIntegrations = []
  //       let companyTicks = []
  //       companyRuns.forEach((run) => {
  //         const integration = integrations.filter(
  //           (integration) => integration.id === run.pk
  //         )
  //         companyIntegrations.push(integration[0])
  //       })
  //       let uniqueCompanyIntegrations = [...new Set(companyIntegrations)]

  //       // add to central integration array
  //       allIntegrations = [...allIntegrations, ...uniqueCompanyIntegrations]

  //       // define ticks
  //       uniqueCompanyIntegrations.forEach((int) => {
  //         tickCounter += 1
  //         const tick = tickCounter
  //         companyTicks.push(tick)

  //         // check integration status
  //         // check status
  //         let integrationStatus = ''
  //         let failedRuns = companyRuns.filter(
  //           (run) => run.run_status === 'failed' && run.pk === int.id
  //         )
  //         let progressRuns = companyRuns.filter(
  //           (run) => run.run_status === 'in progress' && run.pk === int.id
  //         )
  //         if (failedRuns.length === 0) {
  //           if (progressRuns.length === 0) {
  //             integrationStatus = 'success'
  //           } else {
  //             integrationStatus = 'in progress'
  //           }
  //         } else {
  //           integrationStatus = 'failed'
  //         }

  //         int.status = integrationStatus
  //       })

  //       const companyObject = {
  //         name: company,
  //         integrations: uniqueCompanyIntegrations,
  //         ticks: companyTicks,
  //       }

  //       // manual images add
  //       if (company === 'DUCKS') {
  //         companyObject.icon = ducks_icon
  //       }

  //       if (company === 'RSL') {
  //         companyObject.icon = rsl_icon
  //       }

  //       if (company === 'OILERS') {
  //         companyObject.icon = oilers_icon
  //       }

  //       if (company === 'BSE') {
  //         companyObject.icon = bse_icon
  //       }

  //       if (company === 'WILD') {
  //         companyObject.icon = wild_icon
  //       }

  //       if (company === 'GULLS') {
  //         companyObject.icon = gulls_icon
  //       }

  //       if (company === 'SWARM') {
  //         companyObject.icon = swarm_icon
  //       }

  //       if (company === 'CAVALIERS') {
  //         companyObject.icon = cavaliers_icon
  //       }

  //       companyObjectArray.push(companyObject)
  //     }
  //   })
  //   setIntegrationsByCompany(allIntegrations)
  //   setCompanies(companyObjectArray)
  // }

  // const getCompanyRuns = (company) => {
  //   let companyRuns = []
  //   const companyIntegrations = context.integrationsByCustomer[company]
  //   companyIntegrations.forEach((integration) => {
  //     const runs = data.filter((run) => run.pk === integration.id)
  //     companyRuns = [...companyRuns, ...runs]
  //   })
  //   return companyRuns
  // }

  // const getCompanyRunsForChart = (company) => {
  //   let companyRuns = []
  //   const companyIntegrations = integrationsByCompany.filter(
  //     (int) => int.pk === company
  //   )
  //   companyIntegrations.forEach((integration) => {
  //     const runs = data.filter((run) => run.pk === integration.id)
  //     companyRuns = [...companyRuns, ...runs]
  //   })
  //   return companyRuns
  // }

  // const tickToCompany = (tick) => {
  //   try {
  //     return integrationsByCompany[tick - 1].pk
  //   } catch {
  //     return 0
  //   }
  // }

  // const tickToIntegrationId = (tick) => {
  //   return integrationsByCompany[tick - 1].id
  // }

  // const tickToIntegrationName = (tick) => {
  //   return integrationsByCompany[tick - 1].display_name
  // }

  // const integrationToTick = (integrationId) => {
  //   return integrationsByCompany.findIndex(
  //     (integration) => integration.id === integrationId
  //   )
  // }

  // const companyToLabelAlign = (company) => {
  //   const ticks = company.ticks
  //   const labelAlign = (company.ticks[0] + company.ticks[ticks.length - 1]) / 2
  //   return labelAlign
  // }

  const handleZoom = (domain) => {
    const newDomain = {
      x: [0, integrations.length + 1],
      y: [domain.y[0], domain.y[1]],
    }
    setSelectedDomain(newDomain)
  }

  const handleBrush = (domain) => {
    const newDomain = {
      x: [0, integrations.length + 1],
      y: [domain.y[0], domain.y[1]],
    }
    setZoomDomain(newDomain)
  }

  // const filterForErrors = () => {
  //   let companyObjectArray = []
  //   let allIntegrations = []
  //   let tickCounter = 0
  //   allCompanies.forEach((company) => {
  //     const companyRuns = getCompanyRuns(company)
  //     if (companyRuns.length > 0) {
  //       let companyIntegrations = []
  //       let companyTicks = []
  //       companyRuns.forEach((run) => {
  //         const integration = integrations.filter(
  //           (integration) => integration.id === run.pk
  //         )
  //         companyIntegrations.push(integration[0])
  //       })
  //       let uniqueCompanyIntegrations = [...new Set(companyIntegrations)]

  //       // define ticks
  //       uniqueCompanyIntegrations.forEach((int) => {
  //         tickCounter += 1
  //         const tick = tickCounter
  //         companyTicks.push(tick)

  //         // check integration status
  //         // check status
  //         let integrationStatus = ''
  //         let failedRuns = companyRuns.filter(
  //           (run) => run.run_status === 'failed' && run.pk === int.id
  //         )
  //         let progressRuns = companyRuns.filter(
  //           (run) => run.run_status === 'in progress' && run.pk === int.id
  //         )
  //         if (failedRuns.length === 0) {
  //           if (progressRuns.length === 0) {
  //             integrationStatus = 'success'
  //           } else {
  //             integrationStatus = 'in progress'
  //           }
  //         } else {
  //           integrationStatus = 'failed'
  //         }

  //         int.status = integrationStatus

  //         // update to only have integrations with status failed
  //         uniqueCompanyIntegrations = uniqueCompanyIntegrations.filter(
  //           (int) => int.status === 'failed'
  //         )

  //         // add to central integration array
  //         allIntegrations = [...allIntegrations, ...uniqueCompanyIntegrations]
  //       })

  //       const companyObject = {
  //         name: company,
  //         integrations: uniqueCompanyIntegrations,
  //         ticks: companyTicks,
  //       }

  //       // manual images add
  //       if (company === 'DUCKS') {
  //         companyObject.icon = ducks_icon
  //       }

  //       if (company === 'RSL') {
  //         companyObject.icon = rsl_icon
  //       }

  //       if (company === 'OILERS') {
  //         companyObject.icon = oilers_icon
  //       }

  //       if (company === 'BSE') {
  //         companyObject.icon = bse_icon
  //       }

  //       if (company === 'WILD') {
  //         companyObject.icon = wild_icon
  //       }

  //       if (company === 'GULLS') {
  //         companyObject.icon = gulls_icon
  //       }

  //       if (company === 'SWARM') {
  //         companyObject.icon = swarm_icon
  //       }

  //       if (company === 'CAVALIERS') {
  //         companyObject.icon = cavaliers_icon
  //       }

  //       companyObjectArray.push(companyObject)
  //     }
  //   })

  //   setIntegrationsByCompany(allIntegrations)
  //   setCompanies(companyObjectArray)
  //   setActiveChart('errorsOnly')
  // }

  const hourFilter = (hours) => {
    const startDate = subHours(now, hours)
    const newDomain = {
      x: [0, integrations.length + 1],
      y: [startDate, now],
    }
    setZoomDomain(newDomain)
    setSelectedDomain(newDomain)
  }

  const dayFilter = (days) => {
    const startDate = subDays(endDate, days)
    const newDomain = {
      x: [0, integrations.length + 1],
      y: [startDate, endDate],
    }
    setZoomDomain(newDomain)
    setSelectedDomain(newDomain)
  }

  const dates = () => {
    let dates = [endDate]

    for (let i = 1; i < 8; i++) {
      const date = subDays(endDate, i)
      dates.push(date)
    }

    return dates
  }

  const formatDate = (date) => {
    const newDate = addDays(date, 1)
    return format(newDate, 'MMM d')
  }

  const getDatumColor = (datum) => {
    if (datum.run_status === 'failed') {
      return 'red'
    } else if (datum.run_status === 'in progress') {
      return '#F0BC39'
    } else {
      return 'grey'
    }
  }

  // const getColor = (integrationId) => {
  //   const companyName = integrations.find((i) => i.id === integrationId).pk
  //   return getColorByCompany(companyName)
  // }

  // const getTickColor = (tick) => {
  //   const company = tickToCompany(tick)
  //   return getColorByCompany(company)
  // }

  // const getColorByCompany = (companyName) => {
  //   switch (companyName) {
  //     case 'DUCKS':
  //       return '#7EA8BE'
  //       break
  //     case 'RSL':
  //       return '#244B61'
  //       break
  //     case 'OILERS':
  //       return '#7EA8BE'
  //       break
  //     case 'BSE':
  //       return '#3A928D'
  //       break
  //     case 'WILD':
  //       return '#7EA8BE'
  //       break
  //     case 'GULLS':
  //       return '#477289'
  //       break
  //     case 'SWARM':
  //       return '#244B61'
  //       break
  //     case 'CAVALIERS':
  //       return '#244B61'
  //       break
  //     default:
  //       return 'grey'
  //       break
  //   }
  // }

  const getStatusColour = (status) => {
    if (status === 'success') {
      return '#4BC940'
    } else if (status === 'in progress') {
      return '#F0BC39'
    } else {
      return 'red'
    }
  }

  const DataLabel = (props) => {
    const x = props.scale.x(props.x)
    const y = props.scale.y(props.y)
    return <VictoryLabel {...props} x={y} y={x} /> // props are flipped due for horizontal bar chart
  }

  const getIntegrationName = (pk) => {
    const [integration] = integrations.filter(
      (integration) => integration.id === pk
    )
    return integration.display_name
  }

  const formatTime = (time) => {
    const t = new Date(time)
    let minutes = ''
    let seconds = ''
    t.getUTCMinutes() < 10
      ? (minutes = `0${t.getUTCMinutes()}`)
      : (minutes = `${t.getUTCMinutes()}`)
    t.getUTCSeconds() < 10
      ? (seconds = `0${t.getUTCSeconds()}`)
      : (seconds = `${t.getUTCSeconds()}`)
    return `${t.getUTCHours()}:${minutes}:${seconds}`
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-evenly items-end">
        {/* <div className="flex flex-col mb-20">
          <button className="btn-dark" onClick={() => highlightErrors()}>
            Highlight Errors
          </button>
          {/* <button className="btn-dark" onClick={() => filterForErrors()}>
            Integrations with Errors Only
          </button> */}
        {/* <button className="btn-dark">Filter by Data Source</button> */}
        {/* </div> */}
        <div className="text-center">
          <div className="w-100 flex justify-evenly">
            <button
              className="btn-light"
              onClick={() => {
                dayFilter(7)
              }}
            >
              Last Week
            </button>
            <button
              className="btn-light"
              onClick={() => {
                dayFilter(3)
              }}
            >
              Last 3 Days
            </button>
            <button
              className="btn-light"
              onClick={() => {
                hourFilter(24)
              }}
            >
              Last 24 Hours
            </button>
          </div>
          {data.length > 0 && integrations.length > 0 && (
            <VictoryChart
              width={600}
              height={180}
              domain={{ x: [0, integrations.length] }}
              // scale={{ y: 'time' }}
              domainPadding={{ x: [8, 8], y: [0, 0] }}
              padding={{ top: 30, right: 0, bottom: 50, left: 0 }}
              containerComponent={
                <VictoryBrushContainer
                  responsive={false}
                  brushDimension="y"
                  brushDomain={selectedDomain}
                  onBrushDomainChange={handleBrush}
                  brushStyle={{ fill: 'teal', opacity: 0.2 }}
                />
              }
            >
              <VictoryAxis
                dependentAxis={true}
                axisValue={integrations.length + 1}
                orientation="top"
                tickValues={dates()}
                tickFormat={(t) => formatDate(t)}
                tickLabelComponent={
                  <VictoryLabel textAnchor="start" dx={20} dy={5} />
                }
                style={{ grid: { stroke: 'grey', size: 5 } }}
              />
              <VictoryAxis
                dependentAxis={true}
                tickLabelComponent={<VictoryLabel text="" />}
              />
              <VictoryAxis
                style={{ grid: { stroke: '#223F44', size: 5 } }}
                tickLabelComponent={<VictoryLabel text="" />}
              />
              <VictoryBar
                horizontal={true}
                style={{
                  data: {
                    fill: '#223F44',
                    stroke: '#223F44',
                    strokeWidth: 1,
                  },
                }}
                data={data}
                y={(d) =>
                  d.run_end ? Date.parse(d.run_end) : Date.parse(d.run_start)
                } // if run is in progress, set y to run start time
                y0={(d) => Date.parse(d.run_start)}
                barWidth={6}
                x="pk"
              />
            </VictoryChart>
          )}
        </div>
      </div>
      <div>
        {data.length > 0 && integrations.length > 0 && (
          <VictoryChart
            width={850}
            height={350}
            // scale={{ y: 'time' }}
            padding={{ top: 25, right: 50, bottom: 50, left: 100 }}
            domainPadding={{ x: 20 }}
            // domain={{ x: [0, integrationsByCompany.length] }}
            containerComponent={
              <VictoryZoomContainer
                responsive={true}
                zoomDimension="y"
                zoomDomain={zoomDomain}
                allowZoom={false}
                onZoomDomainChange={handleZoom}
              />
            }
          >
            <VictoryAxis
              style={{
                grid: {
                  stroke: 'grey',
                  strokeWidth: 1.5,
                },
              }}
              tickLabelComponent={<VictoryLabel text="" />}
            />
            <VictoryAxis
              dependentAxis={true}
              tickValues={dates()}
              tickFormat={(t) => formatDate(t)}
              tickLabelComponent={<VictoryLabel textAnchor="middle" dy={5} />}
              style={{ grid: { stroke: 'grey', size: 5 } }}
            />
            <VictoryAxis
              dependentAxis={true}
              axisValue={integrations.length + 1}
              orientation="top"
              tickValues={dates()}
              tickFormat={(t) => formatDate(t)}
              tickLabelComponent={<VictoryLabel textAnchor="middle" dy={5} />}
              style={{ grid: { stroke: 'grey', size: 5 } }}
            />
            <VictoryBar
              horizontal={true}
              style={{
                data: {
                  fill: ({ datum }) => getDatumColor(datum),
                  stroke: ({ datum }) => getDatumColor(datum),
                  strokeWidth: 2,
                  cursor: 'pointer',
                },
              }}
              data={data}
              y={(d) =>
                d.run_end ? Date.parse(d.run_end) : Date.parse(d.run_start) + 60
              } // if run is in progress, set y to a minute after, to display bar on chart
              y0={(d) => Date.parse(d.run_start)}
              barWidth={10}
              x="pk"
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onClick: () => {
                      return [
                        {
                          target: 'data',
                          mutation: (props) => {
                            return navigate(`/runs/${props.datum.id}`)
                          },
                        },
                      ]
                    },
                  },
                },
              ]}
              labels={({ datum }) => [
                `${getIntegrationName(datum.pk)}`,
                `${datum.id}`,
                datum.run_status === 'in progress'
                  ? `Start Time: ${formatTime(datum.run_start)}`
                  : `${formatTime(datum.run_start)} to ${formatTime(
                      datum.run_end
                    )} — ${datum.runTotalTime} mins`,
                datum.run_status.toUpperCase(),
              ]}
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{
                    fill: 'white',
                    stroke: 'grey',
                    strokeWidth: 4,
                  }}
                  flyoutPadding={{
                    top: 20,
                    bottom: 20,
                    right: 16,
                    left: 16,
                  }}
                  orientation="top"
                  labelComponent={
                    <VictoryLabel
                      backgroundStyle={{ fill: 'white' }}
                      backgroundPadding={[
                        0,
                        0,
                        0,
                        { top: 2, bottom: 2, right: 16, left: 16 },
                      ]}
                      lineHeight={[2, 1.2, 1.2, 1.7]}
                      style={[
                        {
                          fill: 'grey',
                          fontWeight: 'bold',
                        },
                        { fill: 'black' },
                        { fill: 'black' },
                        {
                          fill: ({ datum }) =>
                            getStatusColour(datum.run_status),
                          fontWeight: 'bold',
                        },
                      ]}
                      id="label"
                    />
                  }
                />
              }
            />
          </VictoryChart>
        )}
      </div>
    </div>
  )
}

export default UserTimeline
