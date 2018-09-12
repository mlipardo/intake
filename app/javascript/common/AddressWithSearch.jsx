import React from 'react'
import PropTypes from 'prop-types'
import InputField from 'common/InputField'
import CountyNameSelect from 'common/county/CountyNameSelect'

const AddressWithSearch = ({onChangeCounty, onSubmit, searchCounty}) => (
  <div className='row'>
    <CountyNameSelect
      id='search-county'
      gridClassName='col-md-3'
      onChange={onChangeCounty}
      value={searchCounty}
    />
    <InputField
      gridClassName='col-md-3'
      id='search-city'
      label='City'
      onChange={() => {}}
    />
    <InputField
      gridClassName='col-md-3'
      id='search-address'
      label='Address'
      onChange={() => {}}
    />
    <div className='col-md-3 address-search'>
      <button className='btn btn-primary' onClick={onSubmit} >Search</button>
    </div>
  </div>
)

AddressWithSearch.propTypes = {
  onChangeCounty: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  searchCounty: PropTypes.string,
}

AddressWithSearch.defaultProps = {
  searchCounty: '',
}

export default AddressWithSearch
