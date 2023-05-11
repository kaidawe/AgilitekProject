import React, { useState, useEffect, useContext } from 'react'
import '../styles/RunDetails.css'
import { Link } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import { useParams } from 'react-router-dom'
import { oneRunAPI } from '../globals/globals'
import axios from 'axios'
import { format } from 'date-fns'
import IntegrationTimeline from '../SingleComponents/IntegrationTimeline'
import Loading from '../SingleComponents/Loading'

const RunDetails = () => {
  const { loggedUser, integrations, runs } = useContext(GlobalContext)
  const { runId } = useParams()
  const [run, setRun] = useState({})
  const [stepHistory, setStepHistory] = useState('')
  const [integration, setIntegration] = useState({})
  const [isShown, setIsShown] = useState(false)

  function handleButtonClick() {
    setIsShown(!isShown)
  }

  // it loads data from integration an run
  useEffect(() => {
    if (runs.length > 0) {
      const run2 = runs.find((run) => run.id === runId)
      setRun(run2 || {})
      console.log('runnnnnnnnnnnnnnnnnnnnnnnn you got: ', run2)
    }

    if (Object.keys(run).length > 0) {
      const integration2 = integrations.find(
        (integration) => integration.id === run.pk
      )
      setIntegration(integration2 || {})
      console.log('innnnnntttttttttttegration you got: ', integration2)
    }
  }, [integrations, runs, run, runId])

  // it checks whether the stepHistory is ready
  useEffect(() => {
    if (stepHistory.length > 0) {
      // from here, stepHistory is populated and ready to be consumed
      console.log('stepHistory you got: ', stepHistory)
    }
  }, [stepHistory, runId])

  // it grabs all step_history for the current run
  useEffect(() => {
    const url = oneRunAPI
    const getStepHistory = async () => {
      try {
        const { data } = await axios({
          url,
          params: {
            integrationId: encodeURIComponent(integration.id),
            runId: encodeURIComponent(run.id),
          },
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        setStepHistory(data)
        return data
      } catch (error) {
        const errorMessage =
          error.message || error || 'Problem getting customers'
        console.log(`###ERROR: ${errorMessage}`)
        return { message: errorMessage }
      }
    }

    // only gets the current run's step_history when there is integration and run
    if (Object.keys(integration).length > 0 && Object.keys(run).length > 0)
      getStepHistory()
  }, [integration, run, runId])

  const getStatusStyle = (status) => {
    if (status === 'failed') {
      return 'text-failed-red text-xl uppercase'
    } else if (status === 'in progress') {
      return 'text-progress-yellow text-xl uppercase'
    } else {
      return 'text-success-green text-xl uppercase'
    }
  }

  return (
    <>
      {loggedUser && loggedUser === 'Administrator' && (
        <Link to="/timeline">
          <button className="text-white bg-main-blue hover:bg-main-blue-hover py-2 px-4 rounded border border-slate m-1">
            Back To Full Timeline
          </button>
        </Link>
      )}
      {loggedUser && loggedUser != 'Administrator' && (
        <Link to="/user-timeline">
          <button className="text-white bg-main-blue hover:bg-main-blue-hover py-2 px-4 rounded border border-slate m-1">
            Back To Full Timeline
          </button>
        </Link>
      )}
      {!loggedUser && (
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-center">Please select a user above.</div>
        </div>
      )}
      {loggedUser && !run && (
        <div className="bg-white shadow rounded-lg p-4">
          <Loading />
        </div>
      )}

      {
        loggedUser && run && (
          <>
            <IntegrationTimeline
              integrationId={integration.id}
              runId={run.id}
            />
            <div className="run-container mt-2 bg-white rounded-xl">
              <div className="title-container">
                <h1 className="text-2xl">{run.id}</h1>
                <h2 className={getStatusStyle(run.run_status)}>
                  {run.run_status}
                </h2>
              </div>
              <div className="details-container">
                <div className="left-column">
                  {run.run_start && (
                    <p>
                      <span style={{ fontWeight: 'bold' }}>Start:</span>{' '}
                      {format(Date.parse(run.run_start), 'MMM d yyyy, h:mm:ss')}
                    </p>
                  )}
                  {run.run_end && (
                    <>
                      <p>
                        <span style={{ fontWeight: 'bold' }}>End:</span>{' '}
                        {format(Date.parse(run.run_end), 'MMM d yyyy, h:mm:ss')}
                      </p>
                      <p>
                        <span style={{ fontWeight: 'bold' }}>Duration:</span>{' '}
                        {run.runTotalTime} minutes
                      </p>
                    </>
                  )}

                  <br></br>
                  <p>
                    <span style={{ fontWeight: 'bold' }}>Description:</span>{' '}
                    {integration.short_description}
                  </p>
                  <p>
                    <span style={{ fontWeight: 'bold' }}>Trigger:</span>{' '}
                    <span>{integration.trigger}</span>
                  </p>
                </div>
                <div className="right-column">
                  <p>
                    <span style={{ fontWeight: 'bold' }}>Destination:</span>{' '}
                    {integration.data_destination}{' '}
                  </p>
                  <p>
                    <span style={{ fontWeight: 'bold' }}>Source:</span>{' '}
                    {integration.original_data_source}
                  </p>
                </div>
              </div>
              {stepHistory.length > 0 && (
                <div className="message-container">
                  <div>
                    {run.run_status === 'failed' && (
                      <div>
                        <p className="text-failed-red font-bold text-center error-msg">
                          Error Message:
                        </p>
                        <p className="text-left">
                          {stepHistory[stepHistory.length - 1].completed_step}
                        </p>
                      </div>
                    )}
                  </div>

                  <br></br>
                  <div>
                    <p className="button-container">
                      <span>
                        There are <strong>{stepHistory.length} items</strong> in
                        the step history.
                      </span>
                    </p>
                  </div>

                  <span className="button-container">
                    <button className="btn-light" onClick={handleButtonClick}>
                      {!isShown ? (
                        <>See Step History</>
                      ) : (
                        <>Hide Step History</>
                      )}
                    </button>
                  </span>

                  {isShown && (
                    <div
                      className="step-history"
                      style={{ overflowY: 'scroll', maxHeight: '200px' }}
                    >
                      {stepHistory.map((step, index) => (
                        <>
                          <div key={index} className="step-container">
                            <p className="font-semibold">
                              {format(
                                Date.parse(step.step_ended),
                                'MMM d, h:mm:ss'
                              )}
                            </p>
                            <p className="ml-6">{step.completed_step}</p>
                          </div>
                          <hr />
                        </>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )
        // || ( // if theres no run show this message
        //   <div className="run-container">
        //     <div className="title-container">
        //       <h1> No Details to show </h1>
        //     </div>
        //   </div>
        // )
      }
    </>
  )
}

export default RunDetails
