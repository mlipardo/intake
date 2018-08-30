import React from 'react'
import PropTypes from 'prop-types'
import ScreeningsTable from 'screenings/ScreeningsTableContainer'
import PageHeader from 'common/PageHeader'
import {BreadCrumb} from 'common/BreadCrumb'

const HomePageButtons = ({snapshot, hotline, createSnapshot, createScreening}) => (
  <div className='pull-right'>
    {
      snapshot &&
      <button type='button'
        className='btn primary-btn'
        disabled={false}
        onClick={createSnapshot}
      >
      Start Snapshot
      </button>
    }
    {
      hotline &&
      <button type='button'
        className='btn primary-btn'
        disabled={false}
        onClick={createScreening}
      >
      Start Screening
      </button>
    }
  </div>
)

HomePageButtons.propTypes = {
  createScreening: PropTypes.func,
  createSnapshot: PropTypes.func,
  hotline: PropTypes.bool,
  snapshot: PropTypes.bool,
}

export const HomePage = ({snapshot, hotline, actions: {createSnapshot, createScreening}}) => (
  <div>
    <div>
      <PageHeader
        pageTitle='Dashboard'
        button={
          <HomePageButtons
            snapshot={snapshot}
            hotline={hotline}
            createSnapshot={createSnapshot}
            createScreening={createScreening}
          />
        }
      />
      <BreadCrumb />
    </div>
    <div className='shim'/>
    <div className='container'>
      <div className='col-sm-12 gap-top homepage-container'>
        { hotline && <ScreeningsTable /> }
      </div>
    </div>
  </div>
)

HomePage.propTypes = {
  actions: PropTypes.shape({
    createScreening: PropTypes.func,
    createSnapshot: PropTypes.func,
  }),
  hotline: PropTypes.bool,
  snapshot: PropTypes.bool,
}
