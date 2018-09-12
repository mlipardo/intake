import React from 'react'
import SelectField from 'common/SelectField'
import PropTypes from 'prop-types'

class CountySelect extends React.PureComponent {
  onChange({target: {value}}) {
    const {counties, onChange} = this.props
    onChange(counties.find((county) => county.value === value) || null)
  }

  render() {
    const {
      counties,
      gridClassName,
      id,
      value,
    } = this.props

    return (
      <SelectField
        gridClassName={gridClassName}
        id={id}
        label='County'
        onChange={this.onChange.bind(this)}
        value={value}
      >
        <option key='' />
        {counties.map((county) => <option key={county.code} value={county.value}>{county.value}</option>)}
      </SelectField>
    )
  }
}

CountySelect.propTypes = {
  counties: PropTypes.array,
  gridClassName: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

CountySelect.defaultProps = {
  value: '',
}

export default CountySelect
