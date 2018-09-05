import React from 'react'
import {shallow} from 'enzyme'
import ScreeningCreateRelationship from 'views/ScreeningCreateRelationship'

describe('ScreeningCreateRelationship', () => {
  let onCancel
  let onSave
  let wrapper
  const candidates = [{
    person: {
      age: '20 yrs',
      dateOfBirth: '01/15/1986',
      id: '1',
      gender: 'Male',
      legacyId: '3',
      name: 'Gohan',
    },
    candidate: {
      age: '30 yrs',
      dateOfBirth: '11/11/1958',
      id: '4157',
      gender: 'Male',
      name: 'Goku',
    },
  }, {
    person: {
      age: '20 yrs',
      dateOfBirth: '01/15/1986',
      id: '1',
      gender: 'Male',
      legacyId: '3',
      name: 'Trunks',
    },
    candidate: {
      age: '40 yrs',
      dateOfBirth: '11/11/1968',
      id: '4158',
      gender: 'Male',
      name: 'Vegeta',
    },
  }]
  const props = {
    onChange: () => {},
    personId: '805',
    candidates: candidates,
  }

  beforeEach(() => {
    onCancel = jasmine.createSpy('onCancel')
    onSave = jasmine.createSpy('onSave')
    wrapper = shallow(
      <ScreeningCreateRelationship {...props} onCancel={onCancel} onSave={onSave}/>
    )
  })

  it('has a button', () => {
    expect(wrapper.find('button').length).toBe(1)
  })
  it('has a ModalComponent', () => {
    expect(wrapper.find('ModalComponent').length).toBe(1)
  })

  it('has two buttons on modalFooter', () => {
    const footer = shallow(wrapper.find('ModalComponent').props().modalFooter)
    expect(footer.find('button').length).toBe(2)
  })

  it('simulate a click on button and show modal', () => {
    wrapper.find('button').simulate('click')
    expect(wrapper.instance().state.show).toBe(true)
  })

  it('passes the props to CreateRelationshipForm', () => {
    const formComponent = wrapper.find('ModalComponent').props().modalBody
    expect(formComponent.props.candidates).toEqual(candidates)
  })

  describe('closeModal', () => {
    it('closes the modal and onCancel have been called', () => {
      wrapper.setState({show: true})
      const footer = wrapper.find('ModalComponent').props().modalFooter
      const cancel = footer.props.children[0]
      expect(wrapper.state().show).toEqual(true)
      cancel.props.onClick()
      expect(wrapper.state().show).toEqual(false)
      expect(onCancel).toHaveBeenCalled()
      expect(onCancel).toHaveBeenCalledWith('805')
    })
  })

  describe('handleShowModal', () => {
    it('set the state show to its inverse', () => {
      wrapper.setState({show: true})
      expect(wrapper.state().show).toBe(true)
      wrapper.instance().handleShowModal()
      expect(wrapper.state().show).toEqual(false)
    })
  })

  describe('saveCreateRelationship', () => {
    it('calls close the modal when the Create Relationship Button is click', () => {
      wrapper.setState({show: true})
      const footer = wrapper.find('ModalComponent').props().modalFooter
      const save = footer.props.children[1]
      expect(wrapper.state().show).toEqual(true)
      save.props.onClick()
      expect(wrapper.state().show).toEqual(false)
      expect(onSave).toHaveBeenCalled()
      expect(onSave).toHaveBeenCalledWith('805')
    })
  })
})
