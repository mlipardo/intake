import {shallow} from 'enzyme'
import SavingIndicator from 'common/SavingIndicator'
import React from 'react'

describe('SavingIndicator', () => {
  it('renders a saving icon', () => {
    const root = shallow(<SavingIndicator />)
    expect(root.find('.fa.fa-spinner').exists()).toEqual(true)
  })

  it('spins faster', () => {
    const root = shallow(<SavingIndicator />)
    expect(root.find('.fa-spin-faster').exists()).toEqual(true)
  })
})
