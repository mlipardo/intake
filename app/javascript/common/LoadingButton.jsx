import LoadingIndicator from 'common/LoadingIndicator'
import PropTypes from 'prop-types'
import React from 'react'

const LoadingButton = ({text = ''}) => (
  <button className='btn btn-primary btn-icon' disabled={true}>
    <LoadingIndicator />
    {text}
  </button>
)

LoadingButton.propTypes = {
  text: PropTypes.string,
}

export default LoadingButton
