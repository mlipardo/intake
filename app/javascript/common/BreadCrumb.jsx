import React from 'react'
import PropTypes from 'prop-types'

export const BreadCrumb = ({
  navigationElements,
}) => (
  <div className='container back-to-dashboard'>
    <div className='row'>
      <div className='col-xs-7'>
        <h5>Back to: <span><a href='/dashboard'>Dashboard</a> {navigationElements.map((nav, index) => (<span key={index}> {'>'} {nav}</span>))}</span></h5>
      </div>
    </div>
  </div>
)

BreadCrumb.propTypes = {
  navigationElements: PropTypes.array,
}

BreadCrumb.defaultProps = {
  navigationElements: [],
}
