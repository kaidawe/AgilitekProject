import '../styles/TabNavigation.css'

export default function RunSchedule() {
  return (
    <div className="box">
      <h2>Runs</h2>
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
