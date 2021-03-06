import {Map, fromJS} from 'immutable'
import * as matchers from 'jasmine-immutable-matchers'
import crossReportFormReducer from 'reducers/crossReportFormReducer'
import {
  clearAllFields,
  clearAllAgencyFields,
  resetFieldValues,
  save as saveCrossReport,
  setAgencyField,
  setAgencyTypeField,
  setField,
  touchAllFields,
  touchField,
  touchAgencyField,
} from 'actions/crossReportFormActions'
import {fetchScreeningSuccess, fetchScreeningFailure} from 'actions/screeningActions'

describe('crossReportFormReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on CLEAR_CROSS_REPORT_VALUES', () => {
    it('returns the cross report with the values reset to blank except county_id', () => {
      const state = fromJS({
        county_id: {
          value: '1234',
          touched: true,
        },
        inform_date: {
          value: '2017-02-20',
          touched: false,
        },
        method: {
          value: 'Child Abuse Form',
          touched: true,
        },
        DISTRICT_ATTORNEY: {
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        },
        LAW_ENFORCEMENT: {
          selected: true,
          touched: false,
          agency: {
            value: '5234',
            touched: true,
          },
        },
        COUNTY_LICENSING: {
          selected: false,
          touched: false,
          agency: {
            value: '',
            touched: false,
          },
        },
        COMMUNITY_CARE_LICENSING: {
          selected: true,
          touched: false,
          agency: {
            value: 'asdf',
            touched: false,
          },
        },
      })
      const action = clearAllFields()
      expect(crossReportFormReducer(state, action)).toEqualImmutable(
        fromJS({
          county_id: {
            value: '1234',
            touched: false,
          },
          inform_date: {
            value: '',
            touched: false,
          },
          method: {
            value: '',
            touched: false,
          },
          DISTRICT_ATTORNEY: {
            selected: false,
            touched: false,
            agency: {
              id: undefined,
              value: '',
              touched: false,
            },
          },
          LAW_ENFORCEMENT: {
            selected: false,
            touched: false,
            agency: {
              id: undefined,
              value: '',
              touched: false,
            },
          },
          COUNTY_LICENSING: {
            selected: false,
            touched: false,
            agency: {
              id: undefined,
              value: '',
              touched: false,
            },
          },
          COMMUNITY_CARE_LICENSING: {
            selected: false,
            touched: false,
            agency: {
              id: undefined,
              value: '',
              touched: false,
            },
          },
        })
      )
    })
  })
  describe('on CLEAR_CROSS_REPORT_AGENCY_VALUES', () => {
    it('returns the cross report with the agency specific data blanked out', () => {
      const state = fromJS({
        county_id: {
          value: '1234',
          touched: true,
        },
        inform_date: {
          value: '2017-02-20',
          touched: false,
        },
        method: {
          value: 'Child Abuse Form',
          touched: true,
        },
        DISTRICT_ATTORNEY: {
          selected: false,
          touched: true,
          agency: {
            value: '1234',
            touched: true,
          },
        },
        LAW_ENFORCEMENT: {
          selected: true,
          touched: false,
          agency: {
            value: '5234',
            touched: true,
          },
        },
        COUNTY_LICENSING: {
          selected: false,
          touched: false,
          agency: {
            value: '',
            touched: false,
          },
        },
        COMMUNITY_CARE_LICENSING: {
          selected: true,
          touched: false,
          agency: {
            value: 'asdf',
            touched: false,
          },
        },
      })
      const action = clearAllAgencyFields('DISTRICT_ATTORNEY')
      expect(crossReportFormReducer(state, action)).toEqualImmutable(
        fromJS({
          county_id: {
            value: '1234',
            touched: true,
          },
          inform_date: {
            value: '2017-02-20',
            touched: false,
          },
          method: {
            value: 'Child Abuse Form',
            touched: true,
          },
          DISTRICT_ATTORNEY: {
            selected: false,
            touched: true,
            agency: {
              value: '',
              touched: false,
            },
          },
          LAW_ENFORCEMENT: {
            selected: true,
            touched: false,
            agency: {
              value: '5234',
              touched: true,
            },
          },
          COUNTY_LICENSING: {
            selected: false,
            touched: false,
            agency: {
              value: '',
              touched: false,
            },
          },
          COMMUNITY_CARE_LICENSING: {
            selected: true,
            touched: false,
            agency: {
              value: 'asdf',
              touched: false,
            },
          },
        })
      )
    })
  })
  describe('on RESET_CROSS_REPORT_VALUES', () => {
    it('updates the cross report form', () => {
      const action = resetFieldValues({
        cross_reports: [
          {
            county_id: '4234',
            inform_date: '2017-02-20',
            method: '',
            agencies: [
              {type: 'DISTRICT_ATTORNEY'},
              {type: 'LAW_ENFORCEMENT'},
            ],
          },
        ],
      })
      const state = fromJS({
        county_id: {
          value: '1234',
          touched: true,
        },
        inform_date: {
          value: '2017-02-20',
          touched: false,
        },
        method: {
          value: 'Child Abuse Form',
          touched: true,
        },
        DISTRICT_ATTORNEY: {
          selected: true,
          touched: false,
          agency: {
            value: '1234',
            touched: true,
          },
        },
        LAW_ENFORCEMENT: {
          selected: true,
          touched: false,
          agency: {
            value: '5234',
            touched: true,
          },
        },
        COUNTY_LICENSING: {
          selected: false,
          touched: false,
          agency: {
            value: '',
            touched: false,
          },
        },
        COMMUNITY_CARE_LICENSING: {
          selected: false,
          touched: false,
          agency: {
            value: '',
            touched: false,
          },
        },
      })
      expect(crossReportFormReducer(state, action)).toEqualImmutable(
        fromJS({
          county_id: {
            value: '4234',
            touched: true,
          },
          inform_date: {
            value: '2017-02-20',
            touched: false,
          },
          method: {
            value: '',
            touched: true,
          },
          DISTRICT_ATTORNEY: {
            selected: true,
            touched: false,
            agency: {
              value: '',
              touched: true,
            },
          },
          LAW_ENFORCEMENT: {
            selected: true,
            touched: false,
            agency: {
              value: '',
              touched: true,
            },
          },
          COUNTY_LICENSING: {
            selected: false,
            touched: false,
            agency: {
              value: '',
              touched: false,
            },
          },
          COMMUNITY_CARE_LICENSING: {
            selected: false,
            touched: false,
            agency: {
              value: '',
              touched: false,
            },
          },
        })
      )
    })
  })
  describe('on FETCH_SCREENING_COMPLETE', () => {
    it('returns the cross report with the values from screening on success', () => {
      const action = fetchScreeningSuccess({
        cross_reports: [
          {
            county_id: '1234',
            inform_date: '2017-02-20',
            method: 'Child Abuse Form',
            agencies: [
              {id: '1', code: '1234', type: 'DISTRICT_ATTORNEY'},
              {id: '2', code: '5234', type: 'LAW_ENFORCEMENT'},
            ],
          },
        ],
      })
      expect(crossReportFormReducer(Map(), action)).toEqualImmutable(
        fromJS({
          county_id: {
            value: '1234',
            touched: false,
          },
          inform_date: {
            value: '2017-02-20',
            touched: false,
          },
          method: {
            value: 'Child Abuse Form',
            touched: false,
          },
          DISTRICT_ATTORNEY: {
            selected: true,
            touched: false,
            agency: {
              id: '1',
              value: '1234',
              touched: false,
            },
          },
          LAW_ENFORCEMENT: {
            selected: true,
            touched: false,
            agency: {
              id: '2',
              value: '5234',
              touched: false,
            },
          },
          COUNTY_LICENSING: {
            selected: false,
            touched: false,
            agency: {
              id: undefined,
              value: '',
              touched: false,
            },
          },
          COMMUNITY_CARE_LICENSING: {
            selected: false,
            touched: false,
            agency: {
              id: undefined,
              value: '',
              touched: false,
            },
          },
        })
      )
    })
    it('returns the last state on failure', () => {
      const action = fetchScreeningFailure()
      expect(crossReportFormReducer(Map(), action))
        .toEqualImmutable(Map())
    })
  })
  describe('on SAVE_CROSS_REPORT', () => {
    it('returns the cross report with the values from screening', () => {
      const action = saveCrossReport({
        cross_reports: [
          {
            county_id: '1234',
            inform_date: '2017-02-20',
            method: 'Child Abuse Form',
            agencies: [],
          },
        ],
      })
      expect(crossReportFormReducer(Map(), action)).toEqualImmutable(
        fromJS({
          county_id: {
            value: '1234',
            touched: false,
          },
          inform_date: {
            value: '',
            touched: false,
          },
          method: {
            value: '',
            touched: false,
          },
          DISTRICT_ATTORNEY: {
            selected: false,
            touched: false,
            agency: {
              id: undefined,
              value: '',
              touched: false,
            },
          },
          LAW_ENFORCEMENT: {
            selected: false,
            touched: false,
            agency: {
              id: undefined,
              value: '',
              touched: false,
            },
          },
          COUNTY_LICENSING: {
            selected: false,
            touched: false,
            agency: {
              id: undefined,
              value: '',
              touched: false,
            },
          },
          COMMUNITY_CARE_LICENSING: {
            selected: false,
            touched: false,
            agency: {
              id: undefined,
              value: '',
              touched: false,
            },
          },
        })
      )
    })
  })
  describe('on SET_CROSS_REPORT_FIELD', () => {
    it('returns the cross report with the newly updated value, but touched remains the same', () => {
      const action = setField('county_id', '123')
      const state = fromJS({county_id: {value: '321', touched: false}})
      expect(crossReportFormReducer(state, action)).toEqualImmutable(
        fromJS({
          county_id: {
            value: '123',
            touched: false,
          },
        })
      )
    })
  })
  describe('on TOUCH_ALL_CROSS_REPORT_FIELDS', () => {
    it('returns the form with all fields touched', () => {
      const action = touchAllFields({
        cross_reports: [
          {
            county_id: '4234',
            inform_date: '2017-02-20',
            method: '',
            agencies: [
              {id: '1', type: 'DISTRICT_ATTORNEY'},
              {id: '2', type: 'LAW_ENFORCEMENT'},
            ],
          },
        ],
      })
      const state = fromJS({
        county_id: {
          value: '1234',
          touched: true,
        },
        inform_date: {
          value: '2017-02-20',
          touched: false,
        },
        method: {
          value: 'Child Abuse Form',
          touched: true,
        },
        DISTRICT_ATTORNEY: {
          selected: true,
          touched: false,
          agency: {
            id: '1',
            value: '1234',
            touched: true,
          },
        },
        LAW_ENFORCEMENT: {
          selected: true,
          touched: false,
          agency: {
            id: '2',
            value: '5234',
            touched: true,
          },
        },
        COUNTY_LICENSING: {
          selected: false,
          touched: false,
          agency: {
            id: undefined,
            value: '',
            touched: false,
          },
        },
        COMMUNITY_CARE_LICENSING: {
          selected: false,
          touched: false,
          agency: {
            id: undefined,
            value: '',
            touched: false,
          },
        },
      })
      expect(crossReportFormReducer(state, action)).toEqualImmutable(
        fromJS({
          county_id: {
            value: '1234',
            touched: true,
          },
          inform_date: {
            value: '2017-02-20',
            touched: true,
          },
          method: {
            value: 'Child Abuse Form',
            touched: true,
          },
          DISTRICT_ATTORNEY: {
            selected: true,
            touched: true,
            agency: {
              id: '1',
              value: '1234',
              touched: true,
            },
          },
          LAW_ENFORCEMENT: {
            selected: true,
            touched: true,
            agency: {
              id: '2',
              value: '5234',
              touched: true,
            },
          },
          COUNTY_LICENSING: {
            selected: false,
            touched: true,
            agency: {
              id: undefined,
              value: '',
              touched: true,
            },
          },
          COMMUNITY_CARE_LICENSING: {
            selected: false,
            touched: true,
            agency: {
              id: undefined,
              value: '',
              touched: true,
            },
          },
        })
      )
    })
  })
  describe('on TOUCH_CROSS_REPORT_FIELD', () => {
    it('returns the cross report value with touched set to true', () => {
      const action = touchField('DISTRICT_ATTORNEY')
      const state = fromJS({DISTRICT_ATTORNEY: {selected: false, touched: false}})
      expect(crossReportFormReducer(state, action)).toEqualImmutable(
        fromJS({
          DISTRICT_ATTORNEY: {
            selected: false,
            touched: true,
          },
        })
      )
    })
  })
  describe('on SET_CROSS_REPORT_AGENCY_TYPE', () => {
    it('sets the value of selected for the agency type', () => {
      const action = setAgencyTypeField('DISTRICT_ATTORNEY', true)
      const state = fromJS({DISTRICT_ATTORNEY: {selected: false, touched: false}})
      expect(crossReportFormReducer(state, action)).toEqualImmutable(
        fromJS({
          DISTRICT_ATTORNEY: {
            selected: true,
            touched: false,
          },
        })
      )
    })
  })
  describe('on TOUCH_CROSS_REPORT_AGENCY_FIELD', () => {
    it('returns the cross report value with touched set to true', () => {
      const action = touchAgencyField('DISTRICT_ATTORNEY')
      const state = fromJS({
        DISTRICT_ATTORNEY: {
          selected: true,
          touched: false,
          agency: {
            value: '1234AAB',
            touched: false,
          },
        },
      })
      expect(crossReportFormReducer(state, action)).toEqualImmutable(
        fromJS({
          DISTRICT_ATTORNEY: {
            selected: true,
            touched: false,
            agency: {
              value: '1234AAB',
              touched: true,
            },
          },
        })
      )
    })
  })
  describe('on SET_CROSS_REPORT_AGENCY', () => {
    it('sets the value of selected for the agency type', () => {
      const action = setAgencyField('DISTRICT_ATTORNEY', '1234AAB')
      const state = fromJS({
        DISTRICT_ATTORNEY: {
          selected: true,
          touched: false,
          agency: {
            value: '',
            touched: false,
          },
        },
      })
      expect(crossReportFormReducer(state, action)).toEqualImmutable(
        fromJS({
          DISTRICT_ATTORNEY: {
            selected: true,
            touched: false,
            agency: {
              value: '1234AAB',
              touched: false,
            },
          },
        })
      )
    })
  })
})
