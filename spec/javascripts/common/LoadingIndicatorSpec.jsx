import {shallow} from 'enzyme'
import LoadingIndicator from 'common/LoadingIndicator'
import React from 'react'

describe('LoadingIndicator', () => {
  it('renders a loading icon', () => {
    const root = shallow(<LoadingIndicator />)
    expect(root.find('.fa.fa-spinner').exists()).toEqual(true)
  })

  it('spins faster', () => {
    const root = shallow(<LoadingIndicator />)
    expect(root.find('.fa-spin-faster').exists()).toEqual(true)
  })
})
