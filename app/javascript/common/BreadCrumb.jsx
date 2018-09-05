import React from 'react'
import PropTypes from 'prop-types'

export const BreadCrumb = ({
  navigationElements,
  hasError,
}) => {
  const klasses = hasError ? 'container back-to-dashboard-error' : 'container back-to-dashboard'
  return (
    <div className={klasses}>
      <div className='row'>
        <div className='col-xs-7'>
          <h5>Back to: <span><a href='/dashboard'>Dashboard</a> {navigationElements.map((nav, index) => (<span key={index}> {'>'} {nav}</span>))}</span></h5>
        </div>
      </div>
    </div>
  )
}

BreadCrumb.propTypes = {
  hasError: PropTypes.bool,
  navigationElements: PropTypes.array,
}

BreadCrumb.defaultProps = {
  navigationElements: [],
}
