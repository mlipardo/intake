import {EDIT_MODE, SHOW_MODE} from 'actions/screeningPageActions'
import {fromJS} from 'immutable'
import {
  getPersonNamesSelector,
  getPersonInformationFlagValuesSelector,
  getModeValueSelector,
  selectDeceased,
  selectProbationYouth,
  selectInformationalMessage,
} from 'selectors/screening/personCardSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('personCardSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getPersonNamesSelector', () => {
    it('returns the formatted name for each participant', () => {
      const participants = [
        {id: '123', first_name: '', middle_name: '', last_name: ''},
        {id: '124', first_name: 'John', middle_name: 'Q', last_name: 'Public'},
        {id: '125', first_name: 'Jane', middle_name: '', last_name: 'Public'},
      ]
      const state = fromJS({participants})
      expect(getPersonNamesSelector(state)).toEqualImmutable(fromJS({
        123: 'Unknown Person',
        124: 'John Q Public',
        125: 'Jane Public',
      }))
    })
  })
  describe('selectDeceased', () => {
    it('return date of death when participant has a date of death', () => {
      const participants = [
        {id: '123', first_name: '', middle_name: '', last_name: ''},
        {id: '124', first_name: 'John', middle_name: 'Q', last_name: 'Public', date_of_death: '05/19/1993'},
        {id: '125', first_name: 'Jane', middle_name: '', last_name: 'Public', date_of_death: '05/11/1990'},
      ]
      const state = fromJS({participants})
      expect(selectDeceased(state)).toEqualImmutable(fromJS({
        123: undefined,
        124: '05/19/1993',
        125: '05/11/1990',
      }))
    })
  })
  describe('selectProbationYouth', () => {
    it('return probation_youth flag for each participant', () => {
      const participants = [
        {id: '123', first_name: '', middle_name: '', last_name: ''},
        {id: '124', first_name: 'John', middle_name: 'Q', last_name: 'Public', probation_youth: true},
        {id: '125', first_name: 'Jane', middle_name: '', last_name: 'Public', probation_youth: false},
      ]
      const state = fromJS({participants})
      expect(selectProbationYouth(state)).toEqualImmutable(fromJS({
        123: undefined,
        124: true,
        125: false,
      }))
    })
  })
  describe('getPersonInformationFlagValuesSelector', () => {
    it('returns the information flag each participant', () => {
      const participants = [
        {id: '123', sensitive: true, sealed: false},
        {id: '124', sensitive: false, sealed: true},
        {id: '125', sensitive: false, sealed: false},
      ]
      const state = fromJS({participants})
      expect(getPersonInformationFlagValuesSelector(state)).toEqualImmutable(fromJS({
        123: 'Sensitive',
        124: 'Sealed',
        125: undefined,
      }))
    })
  })
  describe('getModeValueSelector', () => {
    const screeningPage = {
      mode: EDIT_MODE,
      peopleCards: {person_id_A: SHOW_MODE},
    }
    const state = fromJS({screeningPage})
    describe('when a person id is present in screening page', () => {
      it('returns the mode for that person card', () => {
        expect(getModeValueSelector(state, 'person_id_A')).toEqual(SHOW_MODE)
      })
    })
    describe('when a person id is not present in screening page', () => {
      it('returns SHOW_MODE by default', () => {
        expect(getModeValueSelector(state, 'person_id_Z')).toEqual(SHOW_MODE)
      })
    })
    describe('when no people card modes are stored', () => {
      const screeningPage = {mode: EDIT_MODE}
      const state = fromJS({screeningPage})
      it('returns SHOW_MODE by default', () => {
        expect(getModeValueSelector(state, 'person_id_Z')).toEqual(SHOW_MODE)
      })
    })
  })
  describe('selectInformationalMessage', () => {
    const participants = [
      {id: '123', first_name: '', middle_name: '', last_name: ''},
      {id: '124', first_name: 'John', middle_name: 'Q', last_name: 'Public', date_of_death: '05/19/1993'},
      {id: '125', first_name: 'Jane', middle_name: 'W', last_name: 'Public', probation_youth: true},
      {id: '126', first_name: 'Jane', middle_name: 'E', last_name: 'Public', probation_youth: true, date_of_death: '05/19/1993'},
    ]
    const state = fromJS({participants})
    describe('when a person does not have date_of_death and is not a Probation Youth', () => {
      it('returns no message', () => {
        expect(selectInformationalMessage(state, '123')).toEqual(null)
      })
    })
    describe('when a person has date_of_death', () => {
      it('returns message: Deceased', () => {
        expect(selectInformationalMessage(state, '124')).toEqual('Deceased')
      })
    })
    describe('when a person is a Probation Youth', () => {
      it('returns message: Probation Youth', () => {
        expect(selectInformationalMessage(state, '125')).toEqual('Probation Youth')
      })
    })
    describe('when a person have date_of_death and a Probation Youth', () => {
      it('returns no message', () => {
        expect(selectInformationalMessage(state, '126')).toEqual('Deceased')
      })
    })
  })
})
