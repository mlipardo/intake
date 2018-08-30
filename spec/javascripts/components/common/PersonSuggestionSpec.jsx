import PersonSuggestion from 'common/PersonSuggestion'
import React from 'react'
import {shallow} from 'enzyme'

describe('PersonSuggestion', () => {
  it('renders full name', () => {
    const props = {fullName: 'Bart Jacqueline Simpson, MD'}
    const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
    expect(component.html()).toContain('<strong class="highlighted">Bart Jacqueline Simpson, MD</strong>')
  })

  it('renders legacy source table and id', () => {
    const props = {legacyDescriptor: {legacy_ui_id: '123-456-789', legacy_table_description: 'Client'}}
    const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
    expect(component.html()).toContain('<div>Client ID 123-456-789 in CWS-CMS</div>')
  })

  it('renders just the legacy table if no id exists', () => {
    const props = {legacyDescriptor: {legacy_table_description: 'Client'}}
    const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
    expect(component.html()).toContain('<div>Client in CWS-CMS</div>')
  })

  it('renders html sanitized full name', () => {
    const props = {fullName: '<h3>Bart</h3> <em>Jacqueline</em> <strong>Simpson</strong>, MD'}
    const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
    expect(component.html()).toContain('<strong class="highlighted">Bart <em>Jacqueline</em> Simpson, MD</strong>')
  })

  describe('sensitive', () => {
    it('renders when sensitive', () => {
      const props = {isSensitive: true}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).toContain('Sensitive')
    })

    it('does not render when not sensitive', () => {
      const props = {isSensitive: false}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).not.toContain('Sensitive')
    })
  })
  describe('deceased', () => {
    it('renders when deceased when date of death is present', () => {
      const props = {isDeceased: true}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).toContain('Deceased')
    })

    it('does not render when deceased is not present', () => {
      const props = {isDeceased: false}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).not.toContain('Deceased')
    })
  })
  describe('probation youth', () => {
    it('renders when open case responsible agence code is P - Probation', () => {
      const props = {isProbationYouth: true}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).toContain('Probation Youth')
    })

    it('does not renders when open case responsible agence code is not P - Probation', () => {
      const props = {isProbationYouth: false}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).not.toContain('Probation Youth')
    })
  })
  describe('sealed', () => {
    it('renders when is_sealed', () => {
      const props = {isSealed: true}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).toContain('Sealed')
    })

    it('does not render when not is_sealed', () => {
      const props = {isSealed: false}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).not.toContain('Sealed')
    })
  })

  describe('ssn', () => {
    it('renders when present', () => {
      const props = {ssn: '123-456-7890'}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).toContain(
        '<div><strong class="c-gray half-pad-right">SSN</strong><span class="highlighted">123-456-7890</span></div>'
      )
    })

    it('renders sanitized ssn', () => {
      const props = {ssn: '<em><h3>123-456-7890</h3></em>'}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).toContain(
        '<div><strong class="c-gray half-pad-right">SSN</strong><span class="highlighted"><em>123-456-7890</em></span></div>'
      )
    })

    it('does not render when not present', () => {
      const props = {ssn: null}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).not.toContain('SSN')
    })
  })

  describe('address', () => {
    it('does not render when not present', () => {
      const props = {address: null}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.find('AddressInfo').length).toEqual(0)
    })
  })

  describe('phonenumber', () => {
    it('does not render when not present', () => {
      const props = {phoneNumber: null}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.find('PhoneNumberInfo').length).toEqual(0)
    })
  })

  describe('render components', () => {
    let component
    beforeEach(() => {
      component = shallow(<PersonSuggestion />, {disableLifecycleMethods: true})
    })

    it('renders the GenderRaceAndEthnicity', () => {
      expect(component.find('GenderRaceAndEthnicity').length).toEqual(1)
    })

    it('renders the AgeInfo', () => {
      expect(component.find('AgeInfo').length).toEqual(1)
    })

    it('renders the AddressInfo', () => {
      const props = {address: {}}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.find('AddressInfo').length).toEqual(1)
    })

    it('renders the PhoneNumberInfo', () => {
      const props = {phoneNumber: {}}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.find('PhoneNumberInfo').length).toEqual(1)
    })
  })
})
