import React from 'react'
import {shallow} from 'enzyme'
import CreateRelationshipForm from 'common/relationship/CreateRelationshipForm'

describe('CreateRelationshipForm', () => {
  let onChange
  let createRelationshipForm
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
      relationshipType: '191',
    },
  }]
  const row = candidates[1]
  const props = {
    candidates: candidates,
  }

  beforeEach(() => {
    onChange = jasmine.createSpy('onChange')
    createRelationshipForm = (props) =>
      shallow(<CreateRelationshipForm {...props} onChange={onChange}/>)
  })

  it('renders a BootStrapTable and TableHeaderColumn', () => {
    const component = createRelationshipForm(props)
    expect(component.find('BootstrapTable').length).toBe(1)
    expect(component.find('TableHeaderColumn').length).toBe(3)
  })

  describe('PersonInfoList', () => {
    it('displays a ul and li element', () => {
      const {candidate} = row
      const component = createRelationshipForm(props)
      const PersonInfoList = shallow(
        component.find('TableHeaderColumn').at(0).props().dataFormat(candidate)
      )
      expect(PersonInfoList.find('ul').length).toBe(1)
      expect(PersonInfoList.find('li').length).toBe(3)
      expect(PersonInfoList.find('li').first().text()).toEqual('Vegeta')
    })
  })

  describe('SelectRelationshipType', () => {
    it('passes the props to SelectField', () => {
      const component = createRelationshipForm(props)
      const SelectRelationshipType = component
        .find('TableHeaderColumn')
        .at(1)
        .props()
        .dataFormat({}, row, onChange)
      expect(SelectRelationshipType.props.value).toEqual('191')
    })
    it('simulates click and onChange has been called', () => {
      const component = createRelationshipForm(props)
      const SelectRelationshipType = shallow(
        component
          .find('TableHeaderColumn')
          .at(1)
          .props()
          .dataFormat({}, row, onChange)
      )
      const element = SelectRelationshipType.find('select')
      element.simulate('change', {target: {value: 'Rasengan'}})
      expect(onChange).toHaveBeenCalled()
      expect(onChange).toHaveBeenCalledWith('1', '4158', 'relationshipType', 'Rasengan')
    })
  })
})
