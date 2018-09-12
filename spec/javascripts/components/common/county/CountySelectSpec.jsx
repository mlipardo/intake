import CountySelect from 'common/county/CountySelect'
import React from 'react'
import {shallow} from 'enzyme'

describe('CountySelect', () => {
  function render({
    counties = [],
    gridClassName = 'gridClassName',
    id = 'county-select',
    onChange = () => null,
    value = null,
  }) {
    const props = {
      counties,
      gridClassName,
      id,
      onChange,
      value,
    }
    return shallow(<CountySelect {...props} />)
  }

  it('displays the select field', () => {
    const component = render({counties: [
      {code: '123', value: 'San Francisco'},
      {code: '456', value: 'Sacramento'},
    ]})
    expect(component.find('option[value="San Francisco"]').text()).toEqual('San Francisco')
  })

  it('selects the value passed in', () => {
    const component = render({counties: [
      {code: '123', value: 'San Francisco'},
      {code: '456', value: 'Sacramento'},
    ],
    value: 'San Francisco'})
    expect(component.find('SelectField').props().value).toEqual('San Francisco')
  })

  it('passes id, and gridClassName to select field', () => {
    const component = render({
      gridClassName: 'my-class-name',
      id: 'my-id',
    })
    expect(component.find('SelectField').props().gridClassName).toEqual('my-class-name')
    expect(component.find('SelectField').props().id).toEqual('my-id')
  })

  it('calls back with the full system code when selection changes', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = render({
      counties: [
        {code: '123', value: 'San Francisco'},
        {code: '456', value: 'Sacramento'},
      ],
      onChange,
      value: 'Sacramento',
    })

    component.find('SelectField').props().onChange({target: {value: 'San Francisco'}})

    expect(onChange).toHaveBeenCalledWith({code: '123', value: 'San Francisco'})
  })

  it('calls back with the null when selection changes to unknown code', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = render({
      counties: [
        {code: '123', value: 'San Francisco'},
        {code: '456', value: 'Sacramento'},
      ],
      onChange,
      value: 'Sacramento',
    })

    component.find('SelectField').props().onChange({target: {value: 'Merrimack'}})

    expect(onChange).toHaveBeenCalledWith(null)
  })
})
