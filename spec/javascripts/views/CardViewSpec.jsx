import {EDIT_MODE, SAVING_MODE, SHOW_MODE} from 'actions/screeningPageActions'
import React from 'react'
import {shallow} from 'enzyme'
import CardView from 'views/CardView'
import * as Navigation from 'utils/navigation'

describe('Card View', () => {
  const renderCardView = ({editable = false, ...args}) => {
    const props = {editable, ...args}
    return shallow(<CardView {...props} />)
  }

  it('renders a card anchor', () => {
    const card = renderCardView({})
    expect(card.find('.anchor').exists()).toBe(true)
  })

  it('renders a card', () => {
    const card = renderCardView({})
    expect(card.find('.card').exists()).toEqual(true)
  })

  it('uses the id passed', () => {
    const card = renderCardView({id: 'my-card'})
    expect(card.find('#my-card').exists()).toEqual(true)
  })

  it('renders the title of the card in the header', () => {
    const card = renderCardView({title: 'My Title'})
    const title = card.find('.card-header').children('h2').text()
    expect(title).toEqual('My Title')
  })

  it('displays an edit button if editable is true', () => {
    const onEdit = jasmine.createSpy('onEdit')
    const component = renderCardView({onEdit, editable: true, mode: SHOW_MODE})
    expect(component.find('EditLink').exists()).toEqual(true)
  })

  it('uses the card title for the edit link aria label', () => {
    const onEdit = jasmine.createSpy('onEdit')
    const component = renderCardView({onEdit, title: 'My Title', editable: true, mode: SHOW_MODE})
    expect(component.find('EditLink').props().ariaLabel).toEqual('Edit my title')
  })

  it('calls onEdit when the edit button is clicked', () => {
    const onEdit = jasmine.createSpy('onEdit')
    const component = renderCardView({onEdit, editable: true, mode: SHOW_MODE})
    component.find('EditLink').simulate('click', {preventDefault: () => {}})
    expect(onEdit).toHaveBeenCalled()
  })

  it('does not display an edit button if editable is false', () => {
    const component = renderCardView({editable: false})
    expect(component.find('EditLink').exists()).toEqual(false)
  })

  describe('when mode is edit', () => {
    const mode = EDIT_MODE
    it('adds the edit mode as a class', () => {
      const card = renderCardView({mode})
      expect(card.find('.edit').exists()).toEqual(true)
      expect(card.find('.show').exists()).toEqual(false)
    })

    it('renders the edit prop, but not the show', () => {
      const edit = <span>Edit</span>
      const show = <span>Show</span>
      const card = renderCardView({edit, mode, show})
      expect(card.text()).toContain('Edit')
      expect(card.text()).not.toContain('Show')
    })

    it('passes the onShow prop to the edit prop child', () => {
      const edit = <span className='my-edit'>Edit</span>
      const onShow = jasmine.createSpy('onShow')
      const card = renderCardView({edit, mode, onShow})

      expect(card.find('.my-edit').props().onShow).toEqual(onShow)
    })

    it('passes the onSave prop to the edit prop child', () => {
      const edit = <span className='my-edit'>Edit</span>
      const onSave = jasmine.createSpy('onSave')
      const card = renderCardView({edit, mode, onSave})

      expect(card.find('.my-edit').props().onSave).toEqual(onSave)
    })

    it('navigates to itself when transitioning to show mode', () => {
      spyOn(Navigation, 'setHash')
      const component = renderCardView({mode, id: 'my-card'})
      expect(Navigation.setHash).not.toHaveBeenCalled()

      component.setProps({mode: SHOW_MODE})
      expect(Navigation.setHash).toHaveBeenCalledWith('#my-card-anchor')
    })
  })

  describe('when mode is saving', () => {
    const mode = SAVING_MODE
    it('adds edit as a class', () => {
      const card = renderCardView({mode})
      expect(card.find('.edit').exists()).toEqual(true)
      expect(card.find('.show').exists()).toEqual(false)
    })

    it('renders the edit prop, but not the show', () => {
      const edit = <span>Edit</span>
      const show = <span>Show</span>
      const card = renderCardView({edit, mode, show})
      expect(card.text()).toContain('Edit')
      expect(card.text()).not.toContain('Show')
    })

    it('sets isSaving on the edit prop child', () => {
      const edit = <span className='my-edit'>Edit</span>
      const card = renderCardView({edit, mode})

      expect(card.find('.my-edit').props().isSaving).toEqual(true)
    })

    it('navigates to itself when transitioning to show mode', () => {
      spyOn(Navigation, 'setHash')
      const component = renderCardView({mode, id: 'my-card'})
      expect(Navigation.setHash).not.toHaveBeenCalled()

      component.setProps({mode: SHOW_MODE})
      expect(Navigation.setHash).toHaveBeenCalledWith('#my-card-anchor')
    })
  })

  describe('when mode is show', () => {
    const mode = SHOW_MODE

    it('adds the mode as a class', () => {
      const card = renderCardView({mode})
      expect(card.find('.show').exists()).toEqual(true)
      expect(card.find('.edit').exists()).toEqual(false)
    })

    it('renders the show prop, but not the edit', () => {
      const edit = <span>Edit</span>
      const show = <span>Show</span>
      const card = renderCardView({edit, mode, show})
      expect(card.text()).toContain('Show')
      expect(card.text()).not.toContain('Edit')
    })
  })
})
