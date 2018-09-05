import SavingButton from 'common/SavingButton'
import React from 'react'
import {shallow} from 'enzyme'

describe('SavingButton', () => {
  const render = (props) => shallow(<SavingButton {...props}/>)

  it('is a button', () => {
    expect(render().find('button').exists()).toEqual(true)
  })

  it('is disabled', () => {
    expect(render().find('button').props().disabled).toEqual(true)
  })

  it('has an btn-icon class', () => {
    expect(render().find('.btn-icon').exists()).toEqual(true)
  })

  it('renders a Saving Indicator', () => {
    expect(render().find('button SavingIndicator').exists()).toEqual(true)
  })

  it('renders the given text', () => {
    expect(render({text: 'Hello, world!'}).text()).toContain('Hello, world!')
  })
})
