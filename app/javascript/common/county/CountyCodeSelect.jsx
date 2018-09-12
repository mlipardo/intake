import React from 'react'
import SelectField from 'common/SelectField'
import PropTypes from 'prop-types'

class CountyCodeSelect extends React.Component {
  render() {
    const {
      counties,
      gridClassName,
      id,
      onChange,
      value,
    } = this.props

    return (
      <SelectField
        gridClassName={gridClassName}
        id={id}
        label='County'
        onChange={onChange}
        value={value}
      >
        <option key='' />
        {counties.map((county) => <option key={county.code} value={county.code}>{county.value}</option>)}
      </SelectField>
    )
  }
}

CountyCodeSelect.propTypes = {
  counties: PropTypes.array.isRequired,
  gridClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

CountyCodeSelect.defaultProps = {
  value: '',
}

export default CountyCodeSelect
