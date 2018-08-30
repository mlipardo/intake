import CrossReportForm from 'views/CrossReportForm'
import React from 'react'
import {shallow} from 'enzyme'

describe('CrossReportForm', () => {
  function renderCrossReportForm({
    actions = {},
    allegationsRequireCrossReports = false,
    areCrossReportsRequired = false,
    cardName = '',
    counties = [{code: '1234', value: 'County One'}],
    county_id = '',
    userCounty = null,
    countyAgencies = {
      COMMUNITY_CARE_LICENSING: [],
      COUNTY_LICENSING: [],
      DISTRICT_ATTORNEY: [],
      LAW_ENFORCEMENT: [],
    },
    districtAttorney = {
      selected: false,
      touched: false,
      agency: {
        value: '',
        touched: false,
      },
    },
    lawEnforcement = {
      selected: false,
      touched: false,
      agency: {
        value: '',
        touched: false,
      },
    },
    countyLicensing = {
      selected: false,
      touched: false,
      agency: {
        value: '',
        touched: false,
      },
    },
    communityCareLicensing = {
      selected: false,
      touched: false,
      agency: {
        value: '',
        touched: false,
      },
    },
    errors = {
      inform_date: [],
      method: [],
      COMMUNITY_CARE_LICENSING: [],
      COUNTY_LICENSING: [],
      DISTRICT_ATTORNEY: [],
      LAW_ENFORCEMENT: [],
    },
    inform_date = '',
    method = '',
    hasAgencies = false,
    screening = {},
    screeningWithEdits = {},
    onShow = () => null,
  }) {
    const props = {
      actions,
      allegationsRequireCrossReports,
      areCrossReportsRequired,
      cardName,
      counties,
      county_id,
      userCounty,
      countyAgencies,
      districtAttorney,
      errors,
      lawEnforcement,
      countyLicensing,
      communityCareLicensing,
      inform_date,
      method,
      hasAgencies,
      screening,
      screeningWithEdits,
      onShow,
    }
    return shallow(<CrossReportForm {...props} />, {disableLifecycleMethods: true})
  }
  it('renders the label', () => {
    const component = renderCrossReportForm({})
    expect(component.find('div label').html()).toContain('This report has cross reported to:')
  })
  describe('inform_date', () => {
    it('passes errors to component', () => {
      const component = renderCrossReportForm({
        hasAgencies: true,
        inform_date: '',
        errors: {
          inform_date: ['Date error'],
        },
      })
      expect(component.find('DateField[id="cross_report_inform_date"]').props().errors).toEqual(['Date error'])
    })
    it('does not render DateField if no agencies selected', () => {
      const component = renderCrossReportForm({hasAgencies: false, inform_date: '2017-02-20'})
      expect(component.find('DateField[id="cross_report_inform_date"]').exists()).toEqual(false)
    })
    it('passes the inform_date to DateField', () => {
      const component = renderCrossReportForm({hasAgencies: true, inform_date: '2017-02-20'})
      expect(component.find('DateField[id="cross_report_inform_date"]').props().value).toEqual('2017-02-20')
      expect(component.find('DateField[id="cross_report_inform_date"]').props().required).toEqual(true)
      expect(component.find('DateField[id="cross_report_inform_date"]').props().label).toEqual('Cross Reported on Date')
    })
    it('triggers the setField action on change', () => {
      const setField = jasmine.createSpy('setField')
      const component = renderCrossReportForm({hasAgencies: true, inform_date: '', actions: {setField}})
      component.find('DateField[id="cross_report_inform_date"]').simulate('change', '2016-01-23')
      expect(setField).toHaveBeenCalledWith('inform_date', '2016-01-23')
    })
    it('triggers the touchField action on blur', () => {
      const touchField = jasmine.createSpy('touchField')
      const component = renderCrossReportForm({hasAgencies: true, inform_date: '', actions: {touchField}})
      component.find('DateField[id="cross_report_inform_date"]').simulate('blur')
      expect(touchField).toHaveBeenCalledWith('inform_date')
    })
  })
  describe('method', () => {
    const setField = jasmine.createSpy('setField')
    const touchField = jasmine.createSpy('touchField')
    it('passes errors to component', () => {
      const component = renderCrossReportForm({
        hasAgencies: true,
        method: '1234',
        errors: {method: ['Method error']},
      })
      expect(component.find('SelectField[id="cross_report_method"]').props().errors).toEqual(['Method error'])
    })
    it('does not render SelectField if no agencies selected', () => {
      const component = renderCrossReportForm({hasAgencies: false, method: '2017'})
      expect(component.find('SelectField[id="cross_report_method"]').exists()).toEqual(false)
    })
    it('passes the selected method to method pull down', () => {
      const component = renderCrossReportForm({hasAgencies: true, method: '1234'})
      expect(component.find('SelectField[id="cross_report_method"]').props().value).toEqual('1234')
    })
    it('triggers the setField action on change', () => {
      const component = renderCrossReportForm({hasAgencies: true, method: '', actions: {setField}})
      component.find('SelectField[id="cross_report_method"]').simulate('change', {target: {value: '1234'}})
      expect(setField).toHaveBeenCalledWith('method', '1234')
    })
    it('triggers the touchField action on blur', () => {
      const component = renderCrossReportForm({hasAgencies: true, method: '', actions: {touchField}})
      component.find('SelectField[id="cross_report_method"]').simulate('blur')
      expect(touchField).toHaveBeenCalledWith('method')
    })
  })
  describe('agencies', () => {
    const setAgencyTypeField = jasmine.createSpy('setAgencyTypeField')
    const setAgencyField = jasmine.createSpy('setAgencyField')
    const touchField = jasmine.createSpy('touchField')
    const touchAgencyField = jasmine.createSpy('touchAgencyField')
    const clearAllAgencyFields = jasmine.createSpy('clearAllAgencyFields')
    const actions = {setAgencyField, setAgencyTypeField, touchAgencyField, touchField, clearAllAgencyFields}
    describe('when allegations require cross reports', () => {
      it('makes DISTRICT_ATTORNEY required', () => {
        const component = renderCrossReportForm({
          allegationsRequireCrossReports: true,
          county_id: '12',
          districtAttorney: {selected: true, agency: {value: '1234'}},
          countyAgencies: {
            COMMUNITY_CARE_LICENSING: [],
            COUNTY_LICENSING: [],
            DISTRICT_ATTORNEY: [{id: '123', value: 'asdf'}],
            LAW_ENFORCEMENT: [],
          },
        })
        const field = component.find('CrossReportAgencyField[type="DISTRICT_ATTORNEY"]')
        expect(field.props().required).toEqual(true)
      })
      it('makes LAW_ENFORCEMENT required', () => {
        const component = renderCrossReportForm({
          allegationsRequireCrossReports: true,
          county_id: '12',
          lawEnforcement: {selected: true, agency: {value: '1234'}},
          countyAgencies: {
            COMMUNITY_CARE_LICENSING: [],
            COUNTY_LICENSING: [],
            DISTRICT_ATTORNEY: [],
            LAW_ENFORCEMENT: [{id: '123', value: 'asdf'}],
          },
        })
        const field = component.find('CrossReportAgencyField[type="LAW_ENFORCEMENT"]')
        expect(field.props().required).toEqual(true)
      })
    })
    it('renders DISTRICT_ATTORNEY agency field', () => {
      const component = renderCrossReportForm({
        county_id: '12',
        districtAttorney: {selected: true, agency: {value: '1234'}},
        countyAgencies: {
          COMMUNITY_CARE_LICENSING: [],
          COUNTY_LICENSING: [],
          DISTRICT_ATTORNEY: [{id: '123', value: 'asdf'}],
          LAW_ENFORCEMENT: [],
        },
        errors: {
          DISTRICT_ATTORNEY: ['da is missing'],
        },
        actions,
      })
      const field = component.find('CrossReportAgencyField[type="DISTRICT_ATTORNEY"]')
      expect(field.props().selected).toEqual(true)
      expect(field.props().value).toEqual('1234')
      expect(field.props().countyAgencies).toEqual([{id: '123', value: 'asdf'}])
      expect(field.props().actions).toEqual(actions)
      expect(field.props().errors).toEqual(['da is missing'])
    })
    it('renders LAW_ENFORCEMENT agency field', () => {
      const component = renderCrossReportForm({
        county_id: '12',
        lawEnforcement: {selected: true, agency: {value: '1234'}},
        countyAgencies: {
          COMMUNITY_CARE_LICENSING: [],
          COUNTY_LICENSING: [],
          DISTRICT_ATTORNEY: [],
          LAW_ENFORCEMENT: [{id: '123', value: 'asdf'}],
        },
        errors: {
          LAW_ENFORCEMENT: ['le is missing'],
        },
        actions,
      })
      const field = component.find('CrossReportAgencyField[type="LAW_ENFORCEMENT"]')
      expect(field.props().selected).toEqual(true)
      expect(field.props().value).toEqual('1234')
      expect(field.props().countyAgencies).toEqual([{id: '123', value: 'asdf'}])
      expect(field.props().actions).toEqual(actions)
      expect(field.props().errors).toEqual(['le is missing'])
    })
    it('renders COUNTY_LICENSING agency field', () => {
      const component = renderCrossReportForm({
        county_id: '12',
        countyLicensing: {selected: true, agency: {value: '1234'}},
        countyAgencies: {
          COMMUNITY_CARE_LICENSING: [],
          COUNTY_LICENSING: [{id: '123', value: 'asdf'}],
          DISTRICT_ATTORNEY: [],
          LAW_ENFORCEMENT: [],
        },
        errors: {
          COUNTY_LICENSING: ['cl is missing'],
        },
        actions,
      })
      const field = component.find('CrossReportAgencyField[type="COUNTY_LICENSING"]')
      expect(field.props().selected).toEqual(true)
      expect(field.props().value).toEqual('1234')
      expect(field.props().countyAgencies).toEqual([{id: '123', value: 'asdf'}])
      expect(field.props().actions).toEqual(actions)
      expect(field.props().errors).toEqual(['cl is missing'])
    })
    it('renders COMMUNITY_CARE_LICENSING agency field', () => {
      const component = renderCrossReportForm({
        county_id: '12',
        communityCareLicensing: {selected: true, agency: {value: '1234'}},
        countyAgencies: {
          COMMUNITY_CARE_LICENSING: [{id: '123', value: 'asdf'}],
          COUNTY_LICENSING: [],
          DISTRICT_ATTORNEY: [],
          LAW_ENFORCEMENT: [],
        },
        errors: {
          COMMUNITY_CARE_LICENSING: ['ccl is missing'],
        },
        actions,
      })
      const field = component.find('CrossReportAgencyField[type="COMMUNITY_CARE_LICENSING"]')
      expect(field.props().selected).toEqual(true)
      expect(field.props().value).toEqual('1234')
      expect(field.props().countyAgencies).toEqual([{id: '123', value: 'asdf'}])
      expect(field.props().actions).toEqual(actions)
      expect(field.props().errors).toEqual(['ccl is missing'])
    })
  })
  describe('county selection', () => {
    const clearAllFields = jasmine.createSpy('clearAllFields')
    const fetchCountyAgencies = jasmine.createSpy('fetchCountyAgencies')
    const setField = jasmine.createSpy('setField')
    const actions = {clearAllFields, fetchCountyAgencies, setField}
    const counties = [{code: '0123', value: 'County Zero'}, {code: '1234', value: 'County One'}]

    it('renders the users county when no county set', () => {
      const component = renderCrossReportForm({county_id: '', actions, counties, userCounty: '1234'})
      expect(component.find('CountySelectField[id="cross_report_county"]').props().value).toEqual('1234')
    })
    it('passes the selected county to county pull down', () => {
      const component = renderCrossReportForm({county_id: '1234', counties})
      expect(component.find('CountySelectField[id="cross_report_county"]').props().value).toEqual('1234')
    })
    it('triggers the fetchCountyAgencies action for user county when no county set', () => {
      renderCrossReportForm({county_id: '', actions, counties, userCounty: '1234'})
      expect(fetchCountyAgencies).toHaveBeenCalledWith('1234')
    })
    it('triggers the fetchCountyAgencies action on change', () => {
      const component = renderCrossReportForm({actions, counties})
      component.find('CountySelectField[id="cross_report_county"]').simulate('change', {target: {value: '1234'}})
      expect(fetchCountyAgencies).toHaveBeenCalledWith('1234')
    })
    it('triggers the setField action on change', () => {
      const component = renderCrossReportForm({actions, counties})
      component.find('CountySelectField[id="cross_report_county"]').simulate('change', {target: {value: '1234'}})
      expect(setField).toHaveBeenCalledWith('county_id', '1234')
    })
    it('triggers the clearAllFields action on change', () => {
      const component = renderCrossReportForm({actions, counties})
      component.find('CountySelectField[id="cross_report_county"]').simulate('change', {target: {value: '1234'}})
      expect(clearAllFields).toHaveBeenCalled()
    })
    it('triggers the touchField action on blur', () => {
      const touchField = jasmine.createSpy('touchField')
      const component = renderCrossReportForm({hasAgencies: true, inform_date: '', actions: {touchField}})
      component.find('CountySelectField[id="cross_report_county"]').simulate('blur')
      expect(touchField).toHaveBeenCalledWith('county_id')
    })
  })
  describe('Alert info messages', () => {
    it('renders an alert info message when passed', () => {
      const component = renderCrossReportForm({areCrossReportsRequired: true})
      expect(component.find('AlertInfoMessage').exists()).toEqual(true)
      expect(component.find('AlertInfoMessage').props().message).toEqual(
        'Any report that includes allegations (except General Neglect, Caretaker Absence, or "At risk, sibling abused") must be cross-reported to law enforcement and the district attorney.'
      )
    })
    it('does not render an alert info message when none are present', () => {
      const component = renderCrossReportForm({areCrossReportsRequired: false})
      expect(component.find('AlertInfoMessage').exists()).toEqual(false)
    })
  })
  it('renders a card action row', () => {
    const component = renderCrossReportForm({})
    expect(component.find('CardActionRow').exists()).toEqual(true)
  })
  describe('clicking on cancel', () => {
    it('calls onShow, fires clearCardEdits', () => {
      const clearCardEdits = jasmine.createSpy('clearCardEdits')
      const onShow = jasmine.createSpy('onShow')
      const cardName = 'cross-report-card'
      const component = renderCrossReportForm({actions: {clearCardEdits}, cardName, onShow})

      component.find('CardActionRow').props().onCancel()

      expect(onShow).toHaveBeenCalled()
      expect(clearCardEdits).toHaveBeenCalledWith(cardName)
    })
  })
  describe('clicking on save', () => {
    it('calls onShow, fires saveCard', () => {
      const saveCard = jasmine.createSpy('saveCard')
      const touchAllFields = jasmine.createSpy('touchAllFields')
      const saveCrossReport = jasmine.createSpy('saveCrossReport')
      const onShow = jasmine.createSpy('onShow')
      const screeningWithEdits = {id: 123, crossReports: []}
      const cardName = 'cross-report-card'
      const component = renderCrossReportForm({actions: {saveCard, saveCrossReport, touchAllFields}, screeningWithEdits, cardName, onShow})

      component.find('CardActionRow').props().onSave()

      expect(saveCard).toHaveBeenCalledWith(cardName)
      expect(saveCrossReport).toHaveBeenCalledWith(screeningWithEdits)
      expect(touchAllFields).toHaveBeenCalled()
      expect(onShow).toHaveBeenCalled()
    })
  })
})
