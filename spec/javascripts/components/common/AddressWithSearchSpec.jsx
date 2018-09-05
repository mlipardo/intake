import React from 'react'
import AddressWithSearch from 'common/AddressWithSearch'
import {shallow} from 'enzyme'

describe('AddressWithSearch', () => {
  const render = ({onSubmit = () => {}, onChange = () => {}, ...props} = {}) => (
    shallow(<AddressWithSearch onSubmit={onSubmit} onChange={onChange} {...props} />)
  )

  it("renders address input field with id 'search-address' and label 'Address'", () => {
    const component = render()
    expect(component.find('InputField').props().id).toEqual('search-address')
    expect(component.find('InputField').props().label).toEqual('Address')
  })

  it('renders button for search', () => {
    const component = render()
    expect(component.find('button').text()).toEqual('Search')
  })

  it('calls onSubmit when search button is clicked', () => {
    const onSubmit = jasmine.createSpy('onClick')
    const component = render({onSubmit})
    const searchButton = component.find('.btn-primary')
    searchButton.simulate('click')
    expect(onSubmit).toHaveBeenCalled()
  })
})
