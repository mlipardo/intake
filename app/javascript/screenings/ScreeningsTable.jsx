import PropTypes from 'prop-types'
import React from 'react'
import ScreeningRow from 'screenings/ScreeningRow'

class ScreeningsTable extends React.Component {
  componentDidMount() {
    this.props.clearErrors()
    this.props.fetchScreenings()
  }

  renderTableHead() {
    return (
      <tr>
        <th className='col-md-3' scope='col'>Screening Name</th>
        <th scope='col'>Type/Decision</th>
        <th scope='col'>Status</th>
        <th scope='col'>Assignee</th>
        <th scope='col'>Report Date and Time</th>
      </tr>
    )
  }

  render() {
    return (
      <div className='table-responsive homepage-inner-container'>
        <table className='table table-hover'>
          <thead>{this.renderTableHead()}</thead>
          <tbody>
            {
              this.props.screenings.map(({id, name, screening_decision, screening_decision_detail, assignee, started_at, referral_id, screening_status}) => (
                <ScreeningRow
                  key={id}
                  id={id}
                  name={name}
                  decision={screening_decision}
                  decisionDetail={screening_decision_detail}
                  assignee={assignee}
                  startedAt={started_at}
                  referralId={referral_id}
                  screening_status={screening_status}
                />
              )
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}

ScreeningsTable.propTypes = {
  clearErrors: PropTypes.func,
  fetchScreenings: PropTypes.func,
  screenings: PropTypes.array,
}

ScreeningsTable.defaultProps = {
  screenings: [],
}
export default ScreeningsTable
