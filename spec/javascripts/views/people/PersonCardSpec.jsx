import PersonCard from 'views/people/PersonCard'
import React from 'react'
import {shallow} from 'enzyme'

describe('PersonCard', () => {
  function renderPersonCard({
    deletable = false,
    editable = false,
    informationFlag = undefined,
    mode = 'show',
    onCancel = () => null,
    onDelete = () => null,
    onEdit = () => null,
    onSave = () => null,
    personId = '123',
    personName = 'Bob Smith',
    informationPill = null,
  }) {
    const props = {
      deletable,
      editable,
      informationFlag,
      mode,
      onCancel,
      onDelete,
      onEdit,
      onSave,
      personId,
      personName,
      informationPill,
    }
    return shallow(<PersonCard {...props}/>, {disableLifecycleMethods: true})
  }

  describe('mode is show', () => {
    it('displays a card header', () => {
      const component = renderPersonCard({
        editable: true,
        deletable: true,
        informationFlag: 'Sensitive Or Sealed',
        personName: 'John Q. Public',
        informationPill: 'Deceased',
      })
      const cardHead = component.find('PersonCardHeader')
      expect(cardHead.props().informationFlag).toEqual('Sensitive Or Sealed')
      expect(cardHead.props().showDelete).toEqual(true)
      expect(cardHead.props().showEdit).toEqual(true)
      expect(cardHead.props().title).toEqual('John Q. Public')
      expect(cardHead.props().informationPill).toEqual('Deceased')
    })
    it('renders div with id', () => {
      const component = renderPersonCard({
        mode: 'show',
        personId: '42',
      })
      const div = component.find('div.card')
      expect(div.props().className).toContain('show')
      expect(div.props().id).toContain('participants-card-42')
    })
    it('renders show children', () => {
      const component = shallow(
        <PersonCard
          deletable={true}
          edit={<p>Editing</p>}
          editable={true}
          mode='show'
          onCancel={() => {}}
          onSave={() => {}}
          personId='1234'
          personName='Bob Smith'
          isDeceased={true}
          show={<p>Showing</p>}
        />
      )
      expect(component.find('.card-body').children('p').at(0).text()).toEqual('Showing')
    })
    it('does not render a card action row', () => {
      const component = renderPersonCard({mode: 'show'})
      expect(component.find('CardActionRow').exists()).toEqual(false)
      expect(component.find('button.btn-primary').exists()).toEqual(false)
      expect(component.find('button.btn-default').exists()).toEqual(false)
    })
  })
  describe('mode is edit', () => {
    it('displays a card header', () => {
      const onDelete = jasmine.createSpy('onDelete')
      const onEdit = jasmine.createSpy('onEdit')
      const component = renderPersonCard({
        editable: true,
        deletable: false,
        informationFlag: 'Sensitive Or Sealed',
        personName: 'John Q. Public',
        informationPill: 'Deceased',
        mode: 'edit',
        onDelete,
        onEdit,
      })
      const cardHead = component.find('PersonCardHeader')
      expect(cardHead.props().informationFlag).toEqual('Sensitive Or Sealed')
      expect(cardHead.props().showDelete).toEqual(false)
      expect(cardHead.props().showEdit).toEqual(false)
      expect(cardHead.props().onDelete).toEqual(onDelete)
      expect(cardHead.props().onEdit).toEqual(onEdit)
      expect(cardHead.props().title).toEqual('John Q. Public')
      expect(cardHead.props().informationPill).toEqual('Deceased')
    })
    it('renders div with id', () => {
      const component = renderPersonCard({
        mode: 'edit',
        personId: '42',
      })
      const div = component.find('div.card')
      expect(div.props().className).toContain('edit')
      expect(div.props().id).toContain('participants-card-42')
    })
    it('renders edit children', () => {
      const component = shallow(
        <PersonCard
          deletable={true}
          edit={<p>Editing</p>}
          editable={true}
          mode='edit'
          onCancel={() => {}}
          onSave={() => {}}
          personId='1234'
          personName='Bob Smith'
          show={<p>Showing</p>}
        />
      )
      expect(component.find('.card-body').children('p').at(0).text()).toEqual('Editing')
    })

    it('renders a card action row', () => {
      const component = renderPersonCard({mode: 'edit'})
      expect(component.find('CardActionRow').exists()).toEqual(true)
    })

    it('canceling edit calls onCancel', () => {
      const onCancel = jasmine.createSpy('onCancel')
      const component = renderPersonCard({onCancel, mode: 'edit'})
      component.find('CardActionRow').props().onCancel()
      expect(onCancel).toHaveBeenCalled()
    })

    it('saving changes calls onSave', () => {
      const onSave = jasmine.createSpy('onSave')
      const component = renderPersonCard({onSave, mode: 'edit'})
      component.find('CardActionRow').props().onSave()
      expect(onSave).toHaveBeenCalled()
    })
  })
})
