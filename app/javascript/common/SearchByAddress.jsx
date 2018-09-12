import React from 'react'
import PropTypes from 'prop-types'
import CheckboxField from 'common/CheckboxField'
import AddressWithSearch from 'common/AddressWithSearch'

const SearchByAddress = ({
  isAddressIncluded,
  toggleAddressSearch,
  onChangeCounty,
  onSubmit,
  searchCounty,
}) => (
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
    {
      isAddressIncluded &&
      <AddressWithSearch
        onChangeCounty={onChangeCounty}
        onSubmit={onSubmit}
        searchCounty={searchCounty}
      />
    }
  </div>
)

SearchByAddress.propTypes = {
  isAddressIncluded: PropTypes.bool,
  onChangeCounty: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  searchCounty: PropTypes.string,
  toggleAddressSearch: PropTypes.func,
}

export default SearchByAddress
