import React from 'react'
import {shallow} from 'enzyme'
import ShowField from 'common/ShowField'

describe('ShowField', () => {
  let component

  describe('when only required props are passed', () => {
    it('renders a label with a div wrapper', () => {
      const props = {
        children: <div>Italy</div>,
        label: 'L1',
      }
      component = shallow(<ShowField {...props}/>, {disableLifecycleMethods: true})
      expect(component.html())
        .toEqual('<div class=""><div class="show-label">L1</div><span class="text-area-show"><div>Italy</div></span><div></div></div>')
    })
  })

  describe('when label and className props are passed', () => {
    const props = {
      children: <br/>,
      label: 'Do not judge a component by its label',
      labelClassName: 'working-class object-oriented-class',
      gridClassName: 'giggidy',
    }

    it('renders the label inside the grid wrapper with the classes', () => {
      component = shallow(<ShowField {...props}/>, {disableLifecycleMethods: true})
      expect(component.html())
        .toEqual('<div class="giggidy"><div class="working-class object-oriented-class show-label">Do not judge a component by its label</div><span class="text-area-show"><br/></span><div></div></div>')
      expect(component.find('div.giggidy').props()
        .className).toEqual('giggidy')
    })
  })

  describe('when children are passed', () => {
    const props = {
      children: <h1>Child</h1>,
      label: 'Do not judge a component by its label',
      labelClassName: 'working-class object-oriented-class',
      gridClassName: 'giggidy',
    }

    it('renders the children between the label and ErrorMessages', () => {
      const wrapper = shallow(<ShowField {...props}/>, {disableLifecycleMethods: true}).first('div')
      expect(wrapper.children().length).toEqual(3)
      expect(wrapper.childAt(1).html()).toEqual('<span class="text-area-show"><h1>Child</h1></span>')
      expect(wrapper.find('ErrorMessages').exists()).toEqual(true)
    })
  })

  describe('when errors are passed', () => {
    const props = {
      children: <br/>,
      label: 'Do not judge a component by its label',
      gridClassName: 'working-class object-oriented-class',
      labelClassName: 'trouble-maker',
      errors: ['Please choose wisely.', 'Stick to the plan!'],
    }

    it('renders label and its wrapper with error classes', () => {
      component = shallow(<ShowField {...props}/>, {disableLifecycleMethods: true})
      expect(component.find('div.input-error-label').parent().props()
        .className).toEqual('working-class object-oriented-class input-error')
    })

    it('renders ErrorMessages and passes it errors', () => {
      component = shallow(<ShowField {...props}/>, {disableLifecycleMethods: true})
      expect(component.find('ErrorMessages').props().errors)
        .toEqual(['Please choose wisely.', 'Stick to the plan!'])
    })

    describe('when required', () => {
      beforeEach(() => {
        component = shallow(<ShowField {...props} required/>, {disableLifecycleMethods: true})
      })

      it('renders label as required', () => {
        expect(component.find('div.trouble-maker').props().className).toContain('required')
      })
    })
  })

  describe('when no errors passed', () => {
    const props = {
      children: <br/>,
      label: 'Do not judge a component by its label',
      gridClassName: 'working-class object-oriented-class',
      labelClassName: 'trouble-maker',
    }

    beforeEach(() => {
      component = shallow(<ShowField {...props} required/>, {disableLifecycleMethods: true})
    })

    it('does not display any errors', () => {
      expect(component.find('.input-error').length).toEqual(0)
    })

    it('does not render the label as if it has an error', () => {
      expect(component.find('.input-error-label').length).toEqual(0)
    })

    it('renders ErrorMessages but with no errors', () => {
      expect(component.find('ErrorMessages').exists()).toEqual(true)
      expect(component.find('ErrorMessages').props().errors).toEqual(undefined)
    })

    describe('when is required', () => {
      it('renders required class', () => {
        expect(component.find('div.trouble-maker').props().className)
          .toEqual('trouble-maker show-label required')
      })
    })
  })
})
