import React from 'react'
import {SideBar, NavLinks, NavLink} from 'react-wood-duck'
import PropTypes from 'prop-types'
import SideBarPeople from 'views/SideBarPeople'

const SnapshotSideBar = (props) => (
  <div className='col-md-3 col-xs-4 hide-mobile hidden-print side-bar-container'>
    <h2 className='hidden'>Navigation</h2>
    <SideBar>
      <NavLinks>
        <SideBarPeople participants={props.participants} />
        <NavLink text='Relationships' href='#relationships-card-anchor' />
        <NavLink text='History' href='#history-card-anchor' />
      </NavLinks>
    </SideBar>
  </div>
)

SnapshotSideBar.propTypes = {
  participants: PropTypes.array.isRequired,
}

SnapshotSideBar.defaultProps = {
  participants: [],
}

export default SnapshotSideBar
