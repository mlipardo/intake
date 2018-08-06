import React from 'react'
import {SideBar, NavLinks, NavLink} from 'react-wood-duck'
import PropTypes from 'prop-types'
import nameFormatter from 'utils/nameFormatter'

const SnapshotSideBar = (props) => (
  <div className='col-md-3 col-xs-4 hide-mobile hidden-print side-bar-container'>
    <h2 className='hidden'>Navigation</h2>
    <SideBar>
      <NavLinks>
        <NavLink key={1} text='People & Roles' href='#search-card-anchor' >
          <NavLinks nested={true}>
            <div className='nested-block'>
              {props.participants.map(({id, first_name, last_name, name_suffix}) =>
                <NavLink
                  key={id}
                  text={nameFormatter({first_name, last_name, name_suffix})}
                  href={`#participants-card-${id}`}
                  preIcon='fa fa-user'
                />
              )}
            </div>
          </NavLinks>
        </NavLink>
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
