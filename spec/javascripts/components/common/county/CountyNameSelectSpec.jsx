import CountyNameSelect from 'common/county/CountyNameSelect'
import React from 'react'
import {shallow} from 'enzyme'

describe('CountyNameSelect', () => {
  const render = ({
    gridClassName,
    id = 'county-select',
    onChange = () => {},
    value = '',
  } = {}) => {
    const props = {
      gridClassName,
      id,
      onChange,
      value,
    }
    return shallow(<CountyNameSelect {...props} />)
  }

  const findField = (component) =>
    component.find('Connect(CountiesInjector) CountySelect')

  it('displays the select field with counties injected', () => {
    const component = render()
    expect(findField(component).exists()).toEqual(true)
  })

  it('passes props to the select field', () => {
    const component = render({
      gridClassName: 'foo',
      id: 'my-field',
      value: 'hello',
    })

    const field = findField(component)

    expect(field.props().gridClassName).toEqual('foo')
    expect(field.props().id).toEqual('my-field')
    expect(field.props().value).toEqual('hello')
  })

  it('calls back with the county name when the selection changes', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = render({onChange})

    findField(component).props().onChange({code: '123', value: 'Sacramento'})

    expect(onChange).toHaveBeenCalledWith('Sacramento')
  })
})
