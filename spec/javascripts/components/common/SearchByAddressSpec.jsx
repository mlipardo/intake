import React from 'react'
import SearchByAddress from 'common/SearchByAddress'
import {shallow} from 'enzyme'

describe('SearchByAddress', () => {
  const render = ({onSubmit = () => {}, toggleAddressSearch = () => {}, ...props} = {}) => (
    shallow(<SearchByAddress onSubmit={onSubmit} toggleAddressSearch={toggleAddressSearch} {...props} />)
  )
  describe('when isAddressIncluded flag is false', () => {
    it('renders only Include Address checkbox', () => {
      const searchByAddress = render({isAddressIncluded: false})
      const root = searchByAddress.find('CheckboxField')

      expect(root.props().id).toEqual('include-address')
      expect(root.props().label).toEqual('Include Address')
      expect(searchByAddress.find('InputField').exists()).toBe(false)
      expect(searchByAddress.find('button').exists()).toBe(false)
    })
  })
  describe('when isAddressIncluded flag is true', () => {
    it('renders Include Address checkbox, inputfield and search button', () => {
      const searchByAddress = render({isAddressIncluded: true})

      const root = searchByAddress.find('CheckboxField')
      expect(root.props().id).toEqual('include-address')
      expect(root.props().label).toEqual('Include Address')
      expect(searchByAddress.html())
        .toContain('<input type="text" id="search-address"/></div><div></div></div><div class="col-md-3 address-search"><button class="btn btn-primary">Search</button>')
    })
  })
})
