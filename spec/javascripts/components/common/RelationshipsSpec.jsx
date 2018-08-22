import React from 'react'
import AttachLink from 'common/relationship/AttachLink'
import {shallow} from 'enzyme'
import {EmptyRelationships, Relationships} from 'common/Relationships'

describe('Relationships for Screening', () => {
  const getProps = (component, cardNumber) => (
    component.find('RelationCard').at(cardNumber).props()
  )

  let onClick
  let component
  const renderRelationships = (props) => shallow(<Relationships {...props} isScreening={true} screeningId={'1'} pendingPeople = {['1']} onClick={onClick} />, {disableLifecycleMethods: true})
  const candidates = [
    {
      candidate: {age: '20', candidate_id: '123', dateOfBirth: '01/01/2001', gender: 'male', name: 'John Doe'},
      person: {age: '30', legacy_id: '12345', dateOfBirth: '02/02/2002', gender: 'male', name: 'Larry Doe'},
    },
  ]
  const people = [
    {
      name: 'Sally Jones',
      relationships: [
        {type: 'mother', name: 'Kim Johnson', secondaryRelationship: 'mother', person_card_exists: true},
      ],
    },
    {
      name: 'Nate Starbringer',
      relationships: [
        {type: 'father', name: 'Jim Johnson', secondaryRelationship: 'father', person_card_exists: false},
      ],
    },
    {
      name: 'Jim Johnson',
      relationships: [
        {type: 'son', name: 'Nate Starbringer', secondaryRelationship: 'son', person_card_exists: true},
        {type: 'son', name: 'Sally Jones', secondaryRelationship: 'son', person_card_exists: true},
      ],
    },
    {
      name: 'Cecilia Gomez',
      relationships: [
        {name: 'Jose Gomez', secondaryRelationship: 'son', person_card_exists: true, legacy_descriptor: {legacy_id: '1'}},
        {name: 'Julie Gomez', secondaryRelationship: 'daughter', person_card_exists: true},
      ],
    },
    {name: 'Nally Raymonds', relationships: []},
    {name: 'Kate Winslet', relationships: []},
    {name: 'Kim West', relationships: []},
  ]

  beforeEach(() => {
    onClick = jasmine.createSpy('onClick')
    component = renderRelationships({people, candidates})
  })

  it('renders a RelationCard component for each person with relationships', () => {
    expect(component.find('RelationCard').length).toEqual(4)
  })

  it('render ScreeningCreateRelationshipContainer for each person', () => {
    expect(component.find('Connect(ScreeningCreateRelationship)').length).toEqual(7)
  })

  it('passes correct props name to RelationCard component', () => {
    expect(getProps(component, 0).name).toEqual('Sally Jones')
    expect(getProps(component, 1).name).toEqual('Nate Starbringer')
    expect(getProps(component, 2).name).toEqual('Jim Johnson')
    expect(getProps(component, 3).name).toEqual('Cecilia Gomez')
  })

  it('passes correct props (data) to RelationCard component', () => {
    expect(getProps(component, 0).data[0].name).toEqual('Kim Johnson')
    expect(getProps(component, 0).data[0].secondaryRelationship).toEqual('mother')
    expect(getProps(component, 1).data[0].name).toEqual('Jim Johnson')
    expect(getProps(component, 1).data[0].secondaryRelationship).toEqual('father')
    expect(getProps(component, 2).data[0].name).toEqual('Nate Starbringer')
    expect(getProps(component, 2).data[0].secondaryRelationship).toEqual('son')
    expect(getProps(component, 2).data[1].name).toEqual('Sally Jones')
    expect(getProps(component, 2).data[1].secondaryRelationship).toEqual('son')
    expect(getProps(component, 3).data[0].name).toEqual('Jose Gomez')
    expect(getProps(component, 3).data[0].secondaryRelationship).toEqual('son')
    expect(getProps(component, 3).data[1].name).toEqual('Julie Gomez')
    expect(getProps(component, 3).data[1].secondaryRelationship).toEqual('daughter')
  })

  it('passes the props to RelationCard', () => {
    expect(getProps(component, 0).name).toEqual('Sally Jones')
    expect(getProps(component, 0).data[0].name).toEqual('Kim Johnson')
    expect(getProps(component, 1).name).toEqual('Nate Starbringer')
  })

  it('renders people with no relationships', () => {
    expect(component.find('.no-relationships').at(0).text()).toContain('Nally Raymonds has no known relationships')
    expect(component.find('.no-relationships').at(1).text()).toContain('Kate Winslet has no known relationships')
    expect(component.find('.no-relationships').at(2).text()).toContain('Kim West has no known relationships')
  })
})

describe('Relationships for Snapshot', () => {
  const onClick = jasmine.createSpy('onClick')
  const renderRelationships = (props) =>
    shallow(<Relationships {...props} isScreening={false} onClick={onClick} />, {disableLifecycleMethods: true})

  it('renders people with no relationships', () => {
    const people = [
      {name: 'Sally Jones', relationships: []},
      {name: 'Nate Starbringer', relationships: []},
      {name: 'Jim Johnson', relationships: []},
    ]
    const component = renderRelationships({people})

    expect(component.find('.person').at(0).text()).toEqual('Sally Jones')
    expect(component.find('.person').at(1).text()).toEqual('Nate Starbringer')
    expect(component.find('.person').at(2).text()).toEqual('Jim Johnson')
  })

  it('renders relationships for each person', () => {
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {name: 'Jim Johnson', type: 'mother', person_card_exists: true},
        ],
      },
      {
        name: 'Nate Starbringer',
        relationships: [
          {name: 'Jim Johnson', type: 'father', person_card_exists: false},
        ],
      },
      {
        name: 'Jim Johnson',
        relationships: [
          {name: 'Nate Starbringer', type: 'son', person_card_exists: true},
          {name: 'Sally Jones', type: 'son', person_card_exists: true},
        ],
      },
    ]
    const component = renderRelationships({people}).find(AttachLink)

    expect(component.length).toBe(4)
    expect(component.at(0).prop('relationship')).toEqual({name: 'Jim Johnson', type: 'mother', person_card_exists: true})
    expect(component.at(1).prop('relationship')).toEqual({name: 'Jim Johnson', type: 'father', person_card_exists: false})
    expect(component.at(2).prop('relationship')).toEqual({name: 'Nate Starbringer', type: 'son', person_card_exists: true})
    expect(component.at(3).prop('relationship')).toEqual({name: 'Sally Jones', type: 'son', person_card_exists: true})
  })

  it('renders Age & Age_Units for each person', () => {
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {name: 'Jim Johnson', type: 'mother', age: '(30 yrs)', person_card_exists: true},
        ],
      },
      {
        name: 'Nate Starbringer',
        relationships: [
          {name: 'Jim Johnson', type: 'father', age: '(30 yrs)', person_card_exists: false},
        ],
      },
      {
        name: 'Jim Johnson',
        relationships: [
          {name: 'Nate Starbringer', type: 'son', age: '(20 yrs)', person_card_exists: true},
          {name: 'Sally Jones', type: 'son', age: '(10 yrs)', person_card_exists: true},
        ],
      },
    ]
    const component = renderRelationships({people}).find(AttachLink)

    expect(component.length).toBe(4)
    expect(component.at(0).prop('relationship')).toEqual({name: 'Jim Johnson', type: 'mother', age: '(30 yrs)', person_card_exists: true})
    expect(component.at(1).prop('relationship')).toEqual({name: 'Jim Johnson', type: 'father', age: '(30 yrs)', person_card_exists: false})
    expect(component.at(2).prop('relationship')).toEqual({name: 'Nate Starbringer', type: 'son', age: '(20 yrs)', person_card_exists: true})
    expect(component.at(3).prop('relationship')).toEqual({name: 'Sally Jones', type: 'son', age: '(10 yrs)', person_card_exists: true})
  })

  it('hides Attach link for people in the pending list', () => {
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {name: 'Jim Johnson', type: 'mother', person_card_exists: true, legacy_descriptor: {legacy_id: '1'}},
        ],
      },
      {
        name: 'Nate Starbringer',
        relationships: [
          {name: 'Jim Johnson', type: 'father', person_card_exists: true},
        ],
      },
    ]
    const pendingPeople = ['1']
    const component = renderRelationships({people, pendingPeople}).find(AttachLink)

    expect(component.length).toBe(2)
    expect(component.at(0).prop('relationship')).toEqual({name: 'Jim Johnson', type: 'mother', person_card_exists: true, legacy_descriptor: {legacy_id: '1'}})
    expect(component.at(1).prop('relationship')).toEqual({name: 'Jim Johnson', type: 'father', person_card_exists: true})
  })
})

describe('EmptyRelationships', () => {
  it('renders a reminder to add people when there are no relationships', () => {
    const component = shallow(<EmptyRelationships />, {disableLifecycleMethods: true})
    expect(component.find('.empty-relationships').text()).toEqual('Search for people and add them to see their relationships.')
  })
})
