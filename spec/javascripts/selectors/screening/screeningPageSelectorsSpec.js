import {EDIT_MODE, SAVING_MODE, SHOW_MODE} from 'actions/screeningPageActions'
import {
  getCardModeValueSelector,
  getCardIsEditableSelector,
  getAllCardsAreSavedValueSelector,
  getScreeningHasErrorsSelector,
  getPeopleHaveErrorsSelector,
} from 'selectors/screening/screeningPageSelectors'
import {fromJS} from 'immutable'

describe('screeningPageSelectors', () => {
  describe('getCardModeValueSelector', () => {
    it('returns the current mode for a given card', () => {
      const screeningPage = {cards: {'some-card': 'limbo'}}
      const state = fromJS({screeningPage})
      expect(getCardModeValueSelector(state, 'some-card')).toEqual('limbo')
    })
  })

  describe('getCardIsEditableSelector', () => {
    it('returns false if the screening is read only', () => {
      const screening = {referral_id: '123'}
      const screeningPage = {cards: {'some-card': SHOW_MODE}}
      const state = fromJS({screening, screeningPage})
      expect(getCardIsEditableSelector(state, 'some-card')).toEqual(false)
    })

    it('returns false if the card is already in edit mode', () => {
      const screening = {referral_id: ''}
      const screeningPage = {cards: {'some-card': EDIT_MODE}}
      const state = fromJS({screening, screeningPage})
      expect(getCardIsEditableSelector(state, 'some-card')).toEqual(false)
    })

    it('returns false if the card is in process of saving', () => {
      const screening = {referral_id: ''}
      const screeningPage = {cards: {'some-card': SAVING_MODE}}
      const state = fromJS({screening, screeningPage})
      expect(getCardIsEditableSelector(state, 'some-card')).toEqual(false)
    })

    it('returns true if the card is in show mode and the screening is not read only', () => {
      const screening = {referral_id: ''}
      const screeningPage = {cards: {'some-card': SHOW_MODE}}
      const state = fromJS({screening, screeningPage})
      expect(getCardIsEditableSelector(state, 'some-card')).toEqual(true)
    })
  })

  describe('getAllCardsAreSavedValueSelector', () => {
    it('returns true when all cards are in show mode', () => {
      const screeningPage = {
        peopleCards: {some_id: SHOW_MODE, other_id: SHOW_MODE},
        cards: {some_card: SHOW_MODE, other_card: SHOW_MODE},
      }
      const state = fromJS({screeningPage})
      expect(getAllCardsAreSavedValueSelector(state)).toEqual(true)
    })

    it('returns false when any cards are in edit mode', () => {
      const screeningPage = {
        peopleCards: {some_id: SHOW_MODE, other_id: SHOW_MODE},
        cards: {some_card: SHOW_MODE, other_card: EDIT_MODE},
      }
      const state = fromJS({screeningPage})
      expect(getAllCardsAreSavedValueSelector(state)).toEqual(false)
    })

    it('returns false when any person cards are in edit mode', () => {
      const screeningPage = {
        peopleCards: {some_id: SHOW_MODE, other_id: EDIT_MODE},
        cards: {some_card: SHOW_MODE, other_card: SHOW_MODE},
      }
      const state = fromJS({screeningPage})
      expect(getAllCardsAreSavedValueSelector(state)).toEqual(false)
    })
  })

  describe('getScreeningHasErrorsSelector', () => {
    it('returns false if there are no errors for the screening', () => {
      const screening = {
        report_narrative: 'My narrative',
        screening_decision: 'differential_response',
        communication_method: 'fax',
        assignee: 'Bob Smith',
        started_at: '2002-01-02',
        incident_address: {street_address: '123 Main St', city: 'Sacramento'},
      }
      const state = fromJS({screening})
      expect(getScreeningHasErrorsSelector(state)).toEqual(false)
    })

    it('returns true if the screening has errors for a field', () => {
      const screening = {
        report_narrative: 'My narrative',
        screening_decision: 'differential_response',
        communication_method: 'fax',
        assignee: 'Bob Smith',
        started_at: null,
      }
      const state = fromJS({screening})
      expect(getScreeningHasErrorsSelector(state)).toEqual(true)
    })
  })

  describe('getPeopleHaveErrorsSelector', () => {
    it('returns false if there are no errors for people on the screening', () => {
      const people = [
        {id: 'one', ssn: '123-45-6789', csec_types: ['At Risk'], csec_started_at: '02/02/2222'},
        {id: 'two', ssn: '087-65-4321', csec_types: ['Victim Before Foster Care'], csec_started_at: '02/02/2223'},
      ]
      const state = fromJS({participants: people})
      expect(getPeopleHaveErrorsSelector(state)).toEqual(false)
    })

    it('returns true if any person on the screening has an error', () => {
      const people = [
        {id: 'one', ssn: '123-45-6789'},
        {id: 'two', ssn: '666-12-3456'},
      ]
      const state = fromJS({participants: people})
      expect(getPeopleHaveErrorsSelector(state)).toEqual(true)
    })
    it('returns true if there are errors in the  zip', () => {
      const people = [
        {id: 'one', addresses: [{zip: '1234'}]},
        {id: 'two', addresses: [{zip: '912'}]},
      ]
      const state = fromJS({participants: people})
      expect(getPeopleHaveErrorsSelector(state)).toEqual(true)
    })
    it('returns false if there are no errors on the zip', () => {
      const people = [
        {id: 'one', addresses: [{zip: '12345'}], csec_types: ['At Risk'], csec_started_at: '02/02/2222'},
        {id: 'two', addresses: [{zip: '91212'}], csec_types: ['Victim Before Foster Care'], csec_started_at: '02/02/2223'},
      ]
      const state = fromJS({participants: people})
      expect(getPeopleHaveErrorsSelector(state)).toEqual(false)
    })
  })
})
