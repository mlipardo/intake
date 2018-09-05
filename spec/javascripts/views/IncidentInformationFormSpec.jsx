import React from 'react'
import {shallow} from 'enzyme'
import IncidentInformationForm from 'views/IncidentInformationForm'

describe('IncidentInformationForm', () => {
  const renderIncidentInformationForm = ({
    errors = {incident_address: {}},
    address = {},
    counties = [],
    locationTypes = [],
    usStates = [],
    onCancel = () => {},
    onSave = () => {},
    ...args
  }) => {
    const props = {errors, address, counties, locationTypes, usStates, onCancel, onSave, ...args}
    return shallow(<IncidentInformationForm {...props}/>, {disableLifecycleMethods: true})
  }

  describe('DateField for Incident Date', () => {
    it('renders the incident date field', () => {
      const component = renderIncidentInformationForm({incidentDate: '1/2/2006'})
      expect(component.find('DateField[label="Incident Date"]').props().value).toEqual('1/2/2006')
    })

    it('datetime fires onChange callback', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderIncidentInformationForm({onChange})
      component.find('DateField[label="Incident Date"]').simulate('change', 'new value')
      expect(onChange).toHaveBeenCalledWith(['incident_date'], 'new value')
    })

    it('datetime fires onBlur callback', () => {
      const onBlur = jasmine.createSpy('onBlur')
      const component = renderIncidentInformationForm({onBlur})
      component.find('DateField[label="Incident Date"]').simulate('blur')
      expect(onBlur).toHaveBeenCalledWith(['incident_date'])
    })

    it('renders the incident date field with errors', () => {
      const component = renderIncidentInformationForm({
        errors: {
          incident_date: ['error one'],
          incident_address: {},
        },
      })
      expect(component.find('DateField[label="Incident Date"]').props().errors).toEqual(['error one'])
    })
  })

  describe('Incident Address', () => {
    it('renders the incident address header', () => {
      const component = renderIncidentInformationForm({})
      expect(component.find('legend').text()).toEqual('Incident Address')
    })

    describe('Street Address', () => {
      it('renders the street address field', () => {
        const component = renderIncidentInformationForm({
          address: {
            streetAddress: '1234 C street',
          },
          errors: {
            incident_address: {
              street_address: ['error one'],
            },
          },
        })
        const input = component.find('InputField[label="Address"]')
        expect(input.props().value).toEqual('1234 C street')
        expect(input.props().errors).toEqual(['error one'])
        expect(input.props().required).toEqual(true)
      })

      it('fires onChange callback', () => {
        const onChange = jasmine.createSpy('onChange')
        const component = renderIncidentInformationForm({onChange})
        component.find('InputField[label="Address"]').simulate('change', {target: {value: 'new value'}})
        expect(onChange).toHaveBeenCalledWith(['incident_address', 'street_address'], 'new value')
      })

      it('touches on blur', () => {
        const onBlur = jasmine.createSpy('onBlur')
        const component = renderIncidentInformationForm({onBlur})
        component.find('InputField[label="Address"]').simulate('blur')
        expect(onBlur).toHaveBeenCalledWith(['incident_address', 'street_address'])
      })
    })

    describe('City', () => {
      it('renders the city field', () => {
        const component = renderIncidentInformationForm({
          address: {
            city: 'Sacramento',
          },
        })
        expect(component.find('InputField[label="City"]').props().value).toEqual('Sacramento')
      })

      it('fires onChange callback', () => {
        const onChange = jasmine.createSpy('onChange')
        const component = renderIncidentInformationForm({onChange})
        component.find('InputField[label="City"]').simulate('change', {target: {value: 'new value'}})
        expect(onChange).toHaveBeenCalledWith(['incident_address', 'city'], 'new value')
      })

      it('touches on blur', () => {
        const onBlur = jasmine.createSpy('onBlur')
        const component = renderIncidentInformationForm({onBlur})
        component.find('InputField[label="City"]').simulate('blur')
        expect(onBlur).toHaveBeenCalledWith(['incident_address', 'city'])
      })
    })

    describe('Incident County', () => {
      it('renders the county field', () => {
        const component = renderIncidentInformationForm({
          selectedCounty: 'Yolo',
        })
        expect(component.find('SelectField[label="Incident County"]').props().value).toEqual('Yolo')
      })
      it('is disabled', () => {
        const component = renderIncidentInformationForm({
          selectedCounty: 'Yolo',
        })
        expect(component.find('SelectField[label="Incident County"]').prop('disabled')).toEqual(true)
      })
      it('renders the county options', () => {
        const component = renderIncidentInformationForm({
          counties: [
            {
              key: 'something',
              name: 'name',
            },
          ],
        })
        expect(component.find('option[value="something"]').text()).toEqual('name')
      })

      it('fires onChange callback', () => {
        const onChange = jasmine.createSpy('onChange')
        const component = renderIncidentInformationForm({onChange})
        component.find('SelectField[label="Incident County"]').simulate('change', {target: {value: 'new value'}})
        expect(onChange).toHaveBeenCalledWith(['incident_county'], 'new value')
      })
    })

    describe('State', () => {
      it('renders the state field', () => {
        const component = renderIncidentInformationForm({
          address: {
            state: 'Yolo',
          },
        })
        expect(component.find('SelectField[label="State"]').props().value).toEqual('Yolo')
      })
      it('renders the state options', () => {
        const component = renderIncidentInformationForm({
          usStates: [
            {
              code: 'CA',
              name: 'California',
            },
          ],
        })
        expect(component.find('SelectField[label="State"] option[value="CA"]').text()).toEqual('California')
      })

      it('fires onChange callback', () => {
        const onChange = jasmine.createSpy('onChange')
        const component = renderIncidentInformationForm({onChange})
        component.find('SelectField[label="State"]').simulate('change', {target: {value: 'new value'}})
        expect(onChange).toHaveBeenCalledWith(['incident_address', 'state'], 'new value')
      })
    })

    describe('Zip Code', () => {
      it('renders the zip code field', () => {
        const component = renderIncidentInformationForm({
          address: {
            zip: '95675',
          },
        })
        expect(component.find('InputField[label="Zip"]').props().value).toEqual('95675')
      })

      it('fires onChange callback', () => {
        const onChange = jasmine.createSpy('onChange')
        const component = renderIncidentInformationForm({onChange})
        component.find('InputField[label="Zip"]').simulate('change', {target: {value: 'new value'}})
        expect(onChange).toHaveBeenCalledWith(['incident_address', 'zip'], 'new value')
      })
    })
  })

  describe('Location of Children', () => {
    it('displays the current location of the child', () => {
      const component = renderIncidentInformationForm({locationOfChildren: 'everthing is good'})
      const locationOfChildrenField = component.find('TextAreaCount')
      expect(locationOfChildrenField.props().value).toEqual('everthing is good')
    })
    it('calls onChange when the current location of child changes', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderIncidentInformationForm({onChange})
      component.find('TextAreaCount').simulate('change', {target: {value: 'new value'}})
      expect(onChange).toHaveBeenCalledWith(['current_location_of_children'], 'new value')
    })
  })

  describe('Location Type', () => {
    it('renders the location type field', () => {
      const component = renderIncidentInformationForm({
        selectedLocationType: 'location type',
      })
      expect(component.find('SelectField[label="Location Type"]').props().value).toEqual('location type')
    })

    it('renders the location type options', () => {
      const component = renderIncidentInformationForm({
        locationTypes: [
          {
            name: 'location name',
            locations: [
              'location one',
              'location two',
            ],
          },
        ],
      })
      expect(component.find('SelectField[label="Location Type"] optgroup[label="location name"] optgroup[value="location name"]').exists()).toEqual(true)
      expect(component.find('optgroup[value="location name"] option[value="location one"]').text()).toEqual('location one')
      expect(component.find('optgroup[value="location name"] option[value="location two"]').text()).toEqual('location two')
    })

    it('fires onChange callback', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderIncidentInformationForm({onChange})
      component.find('SelectField[label="Location Type"]').simulate('change', {target: {value: 'new value'}})
      expect(onChange).toHaveBeenCalledWith(['location_type'], 'new value')
    })
  })

  it('renders a card action row', () => {
    const component = renderIncidentInformationForm({})
    expect(component.find('CardActionRow').exists()).toEqual(true)
    expect(component.find('CardActionRow').props().isSaving).not.toBeTruthy()
  })

  it('passes isSaving through to CardActionRow', () => {
    const component = renderIncidentInformationForm({isSaving: true})
    expect(component.find('CardActionRow').props().isSaving).toEqual(true)
  })

  it('canceling edit calls onCancel', () => {
    const onCancel = jasmine.createSpy('onCancel')
    const component = renderIncidentInformationForm({onCancel})
    component.find('CardActionRow').props().onCancel()
    expect(onCancel).toHaveBeenCalled()
  })

  it('saving changes calls onSave', () => {
    const onSave = jasmine.createSpy('onSave')
    const component = renderIncidentInformationForm({onSave})
    component.find('CardActionRow').props().onSave()
    expect(onSave).toHaveBeenCalled()
  })
})
