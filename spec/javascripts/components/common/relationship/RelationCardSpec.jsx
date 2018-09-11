import React from 'react'
import RelationCard from 'common/relationship/RelationCard'
import {mount} from 'enzyme'
import AttachLink from 'common/relationship/AttachLink'

describe('RelationCard', () => {
  const props = {
    person: {
      name: 'Sally Jones',
      relationships: [{
        type: 'mother',
        name: 'Kim Johnson',
        secondaryRelationship: 'mother',
        person_card_exists: true,
      }, {
        type: 'father',
        name: 'Bugs Bunny',
        secondaryRelationship: 'father',
        person_card_exists: false,
      }],
    },
    isScreening: true,
    screeningId: '1',
    onClick: () => {},
    onSave: () => {},
    editFormRelationship: {
      absent_parent_indicator: false,
      client_id: 'ZXY123',
      end_date: '2010-10-01',
      id: '12345',
      relationship_type: 181,
      relative_id: 'ABC987',
      same_home_status: 'Y',
      start_date: '1999-10-01',
    },
    onChange: () => {},
    onEdit: () => {},
    pendingPeople: [],
  }
  const renderRelationCard = (props) => mount(<RelationCard {...props}/>, {disableLifecycleMethods: true})

  it('has a BootstrapTable', () => {
    expect(renderRelationCard(props).find('BootstrapTable').length).toBe(1)
  })

  it('has a TableHeaderColumn', () => {
    expect(renderRelationCard(props).find('TableHeaderColumn').length).toBe(4)
  })

  it('has a TableHeaderColumn Name, Relationship, Age and Actions', () => {
    expect(renderRelationCard(props).find('TableHeaderColumn').at(0).text()).toEqual('Name')
    expect(renderRelationCard(props).find('TableHeaderColumn').at(1).text()).toEqual('Relationship')
    expect(renderRelationCard(props).find('TableHeaderColumn').at(2).text()).toEqual('Age')
    expect(renderRelationCard(props).find('TableHeaderColumn').at(3).text()).toEqual('Actions')
  })

  it('has a Actions TableHeaderColumn and width is 15%', () => {
    expect(renderRelationCard(props).find('TableHeaderColumn').at(3).prop('width')).toEqual('15%')
  })

  it('has 2 Attach links', () => {
    expect(renderRelationCard(props).find(AttachLink).length).toBe(2)
  })

  it('Attach link has the right props', () => {
    expect(renderRelationCard(props).find(AttachLink).at(0).prop('relationship')).toEqual({
      type: 'mother',
      name: 'Kim Johnson',
      secondaryRelationship: 'mother',
      person_card_exists: true,
    })

    expect(renderRelationCard(props).find(AttachLink).at(1).prop('relationship')).toEqual({
      type: 'father',
      name: 'Bugs Bunny',
      secondaryRelationship: 'father',
      person_card_exists: false,
    })
  })

  it('renders the firstName and lastName', () => {
    expect(renderRelationCard(props).find('.child-name').text()).toEqual('Sally Jones')
  })

  describe('BootstrapTable', () => {
    const render = renderRelationCard(props)

    it('has props data passed by RelationCard', () => {
      expect(render.find('BootstrapTable').prop('data')).toBe(props.person.relationships)
    })
  })
})
