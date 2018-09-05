import React from 'react'
import PropTypes from 'prop-types'
import {SHOW_MODE} from 'actions/screeningPageActions'
import CardView from 'views/CardView'

class HistoryOfInvolvement extends React.Component {
  render() {
    const {historyIsEmpty, empty, notEmpty} = this.props
    return (
      <CardView
        id='history-card'
        title='History'
        mode={SHOW_MODE}
        show={historyIsEmpty ? empty : notEmpty}
      />
    )
  }
}

HistoryOfInvolvement.propTypes = {
  empty: PropTypes.object,
  historyIsEmpty: PropTypes.bool.isRequired,
  notEmpty: PropTypes.object,
}

export default HistoryOfInvolvement
