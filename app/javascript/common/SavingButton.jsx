import SavingIndicator from 'common/SavingIndicator'
import PropTypes from 'prop-types'
import React from 'react'

const SavingButton = ({text = ''}) => (
  <button className='btn btn-primary btn-icon' disabled={true}>
    <SavingIndicator />
    {text}
  </button>
)

SavingButton.propTypes = {
  text: PropTypes.string,
}

export default SavingButton
