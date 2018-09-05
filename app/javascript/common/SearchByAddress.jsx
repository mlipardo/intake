import React from 'react'
import PropTypes from 'prop-types'
import CheckboxField from 'common/CheckboxField'
import AddressWithSearch from 'common/AddressWithSearch'

const SearchByAddress = ({isAddressIncluded, toggleAddressSearch, onSubmit}) => (
  <div>
    <div className='row'>
      <div className='col-md-3'>
        <CheckboxField
          id='include-address'
          label='Include Address'
          onChange={toggleAddressSearch}
          value='include-address'
        />
      </div>
    </div>
    {isAddressIncluded && <AddressWithSearch onSubmit={onSubmit} />}
  </div>
)

SearchByAddress.propTypes = {
  isAddressIncluded: PropTypes.bool,
  onSubmit: PropTypes.func,
  toggleAddressSearch: PropTypes.func,
}

export default SearchByAddress
