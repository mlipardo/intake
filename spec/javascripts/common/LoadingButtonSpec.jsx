import LoadingButton from 'common/LoadingButton'
import React from 'react'
import {shallow} from 'enzyme'

describe('LoadingButton', () => {
  const render = (props) => shallow(<LoadingButton {...props}/>)

  it('is a button', () => {
    expect(render().find('button').exists()).toEqual(true)
  })

  it('is disabled', () => {
    expect(render().find('button').props().disabled).toEqual(true)
  })

  it('has an btn-icon class', () => {
    expect(render().find('.btn-icon').exists()).toEqual(true)
  })

  it('renders a Loading Indicator', () => {
    expect(render().find('button LoadingIndicator').exists()).toEqual(true)
  })

  it('renders the given text', () => {
    expect(render({text: 'Hello, world!'}).text()).toContain('Hello, world!')
  })
})
