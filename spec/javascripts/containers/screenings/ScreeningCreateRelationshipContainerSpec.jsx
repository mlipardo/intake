import ScreeningCreateRelationshipContainer from 'containers/screenings/ScreeningCreateRelationshipContainer'
import React from 'react'
import {createMockStore} from 'redux-test-utils'
import {fromJS} from 'immutable'
import {mount,shallow} from 'enzyme'

describe('ScreeningCreateRelationshipContainer', () => {
  const state = fromJS({
    relationships: [{
      date_of_birth: '2014-01-15', first_name: 'Mohammed', gender: 'male',
      id: '1', last_name: 'John', middle_name: '',
      name_suffix: '', sealed: false, sensitive: false,
      candidate_to: [{
        candidate_age: 20, candidate_first_name: 'Tina', candidate_id: '5508',
        candidate_last_name: 'Carwithan', candidate_middle_name: '',
        candidate_name_suffix: '',
      }],
      relationships: [{}],
    }],
  })
  const store = createMockStore(state)
  let component
  beforeEach(() => {
    const context = {store}
    component = mount(<ScreeningCreateRelationshipContainer personId='1'/>, {context}, {disableLifecycleMethods: true})
  })

  console.log(component)

  it('renders candidates', () => {
    const props = component.find('ScreeningCreateRelationship').props()
    console.log(props.debug)
    expect(component.find('ScreeningCreateRelationship').props()).toEqual([{
        person: {personId: '1', dateOfBirth: '01/15/2014', legacyId: undefined, name: 'Mohammed John', gender: 'male', age: ''},
        candidate: {candidateId: '5508', name: 'Tina Carwithan', gender: undefined, dateOfBirth: '', age: ''}
      }],
    )
  })
})


