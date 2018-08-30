import PropTypes from 'prop-types'
import React from 'react'
import LoadingButton from 'common/LoadingButton'

const CardActionRow = ({isLoading, onCancel, onSave}) => (
  <div className='row'>
    <div className='col-md-12'>
      <div className='pull-right'>
        {!isLoading &&
          <button className='btn btn-default' onClick={onCancel}>Cancel</button>}
        {isLoading ?
          <LoadingButton text='Saving'/> :
          <button className='btn btn-primary' onClick={onSave}>Save</button>}
      </div>
    </div>
  </div>
)

CardActionRow.propTypes = {
  isLoading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default CardActionRow
