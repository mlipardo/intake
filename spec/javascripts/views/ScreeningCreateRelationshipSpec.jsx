import React from 'react'
import {shallow} from 'enzyme'
import ScreeningCreateRelationship from 'views/ScreeningCreateRelationship'

describe('ScreeningCreateRelationship', () => {
  const data = [{
    person: 'Sally Fields 25 yrs Male',
    candidate: 'Sam Fields 30 yrs Male',
  }]
  const cell = {name: 'Sally Fields', age: '25 yrs', gender: 'M'}
  const wrapper = shallow(<ScreeningCreateRelationship data={data}/>)

  it('has a button', () => {
    expect(wrapper.find('button').length).toBe(1)
  })
  it('has a ModalComponent', () => {
    expect(wrapper.find('ModalComponent').length).toBe(1)
  })

  it('simulate a click on button and show modal', () => {
    wrapper.find('button').simulate('click')
    expect(wrapper.instance().state.show).toBe(true)
  })

  it('closes the modal', () => {
    wrapper.setState({show: true})
    expect(wrapper.instance().state.show).toBe(true)
    wrapper.instance().closeModal()
    expect(wrapper.instance().state.show).toEqual(false)
  })

  it('closes the modal when the cancel button is clicked', () => {
    wrapper.setState({show: true})
    const footer = wrapper.find('ModalComponent').props().modalFooter
    const cancel = footer.props.children[0]
    expect(wrapper.state().show).toEqual(true)
    cancel.props.onClick()
    expect(wrapper.state().show).toEqual(false)
  })

  it('displayFormatter has name, age and gender', () => {
    const displayTable = shallow(wrapper.instance().displayFormatter(cell))
    expect(displayTable.find('ul').length).toBe(1)
    expect(displayTable.find('li').length).toBe(3)
    expect(displayTable.find('ul').first().find('li').first().text()).toEqual('Sally Fields')
    expect(displayTable.find('ul').first().find('li').at(1).text()).toEqual('25 yrs')
    expect(displayTable.find('ul').first().find('li').last().text()).toEqual('Male')
  })
})
describe('Display Gender if the data is male/female/unknown/intersex', () => {
  const genderData = [{
    person: 'Sally Fields 25 yrs Male',
    candidate: 'Sam Fields 30 yrs Male',
  }]
  const cell = {name: 'Sally Fields', age: '25 yrs', gender: 'male'}
  const wrapper = shallow(<ScreeningCreateRelationship data={genderData}/>)
  it('Displays gender as Male if the data is male', () => {
    const displayTable = shallow(wrapper.instance().displayFormatter(cell))
    expect(displayTable.find('ul').length).toBe(1)
    expect(displayTable.find('li').length).toBe(3)
    expect(displayTable.find('ul').first().find('li').first().text()).toEqual('Sally Fields')
    expect(displayTable.find('ul').first().find('li').at(1).text()).toEqual('25 yrs')
    expect(displayTable.find('ul').first().find('li').last().text()).toEqual('Male')
  })
})
describe('Display Gender if the data is M/F/I/U', () => {
  const genderData = [{
    person: 'Sally Fields 25 yrs Male',
    candidate: 'Sam Fields 30 yrs Male',
  }]
  const cell = {name: 'Sally Fields', age: '25 yrs', gender: 'M'}
  const wrapper = shallow(<ScreeningCreateRelationship data={genderData}/>)
  it('Displays gender as Male if the data is M', () => {
    const displayTable = shallow(wrapper.instance().displayFormatter(cell))
    expect(displayTable.find('ul').length).toBe(1)
    expect(displayTable.find('li').length).toBe(3)
    expect(displayTable.find('ul').first().find('li').first().text()).toEqual('Sally Fields')
    expect(displayTable.find('ul').first().find('li').at(1).text()).toEqual('25 yrs')
    expect(displayTable.find('ul').first().find('li').last().text()).toEqual('Male')
  })
})
