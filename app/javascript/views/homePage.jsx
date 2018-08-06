import React from 'react'
import PropTypes from 'prop-types'
import ScreeningsTable from 'screenings/ScreeningsTableContainer'
import PageHeader from 'common/PageHeader'

const HomePageButtons = ({snapshot, hotline, createSnapshot, createScreening}) => (
  <div>
    {
      snapshot &&
      <button type='button'
        className='btn primary-btn pull-right'
        disabled={false}
        onClick={createSnapshot}
        style={{marginRight: '10px'}}
      >
      Start Snapshot
      </button>
    }
    {
      hotline &&
      <button type='button'
        className='btn primary-btn pull-right'
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
    </div>
    <div className='container'>
      <div className='row gap-top'>
        <div className='col-md-3' />
        <div className='col-md-9 homepage-container'>
          { hotline && <ScreeningsTable /> }
        </div>
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

