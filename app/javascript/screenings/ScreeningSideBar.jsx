import React from 'react'
import {SideBar, NavLinks, NavLink} from 'react-wood-duck'
import PropTypes from 'prop-types'
import SideBarPeople from 'views/SideBarPeople'

const ScreeningSideBar = (props) => (
  <div className='col-xs-4 col-md-3 hide-mobile hidden-print pad-top side-bar-container'>
    <h2 className='hidden'>Navigation</h2>
    <SideBar>
      <NavLinks>
        <NavLink text='Screening Information' href='#screening-information-card-anchor' />
        <SideBarPeople participants={props.participants} />
        <NavLink text='Narrative' href='#narrative-card-anchor' />
        <NavLink text='Incident Information' href='#incident-information-card-anchor' />
        <NavLink text='Allegations' href='#allegations-card-anchor' />
        <NavLink text='Relationships' href='#relationships-card-anchor' />
        <NavLink text='Worker Safety' href='#worker-safety-card-anchor' />
        <NavLink text='History' href='#history-card-anchor' />
        <NavLink text='Cross Report' href='#cross-report-card-anchor' />
        <NavLink text='Decision' href='#decision-card-anchor' />
      </NavLinks>
    </SideBar>
  </div>
)

ScreeningSideBar.propTypes = {
  participants: PropTypes.array.isRequired,
}

ScreeningSideBar.defaultProps = {
  participants: [],
}

export default ScreeningSideBar
